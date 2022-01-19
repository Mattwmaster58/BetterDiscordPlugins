//META{"name":"mathHelper","displayName":"Math Helper","website":"https://github.com/Mattwmaster58/BetterDiscordPlugins","source":"https://raw.githubusercontent.com/planetarian/BetterDiscordPlugins/master/MathHelper.plugin.js"}*//
/*@cc_on
@if (@_jscript)
	// Offer to self-install for clueless users that try to run this directly.
	var shell = WScript.CreateObject("WScript.Shell");
	var fs = new ActiveXObject("Scripting.FileSystemObject");
	var pathPlugins = shell.ExpandEnvironmentStrings("%APPDATA%\BetterDiscord\plugins");
	var pathSelf = WScript.ScriptFullName;
	// Put the user at ease by addressing them in the first person
	shell.Popup("It looks like you've mistakenly tried to run me directly. \n(Don't do that!)", 0, "I'm a plugin for BetterDiscord", 0x30);
	if (fs.GetParentFolderName(pathSelf) === fs.GetAbsolutePathName(pathPlugins)) {
		shell.Popup("I'm in the correct folder already.", 0, "I'm already installed", 0x40);
	} else if (!fs.FolderExists(pathPlugins)) {
		shell.Popup("I can't find the BetterDiscord plugins folder.\nAre you sure it's even installed?", 0, "Can't install myself", 0x10);
	} else if (shell.Popup("Should I copy myself to BetterDiscord's plugins folder for you?", 0, "Do you need some help?", 0x34) === 6) {
		fs.CopyFile(pathSelf, fs.BuildPath(pathPlugins, fs.GetFileName(pathSelf)), true);
		// Show the user where to put plugins in the future
		shell.Exec("explorer " + pathPlugins);
		shell.Popup("I'm installed!", 0, "Successfully installed", 0x40);
	}
	WScript.Quit();

@else@*/

let mathHelper = (() => {
  const config = {
    info: {
      name: "Math Helper",
      authors: [
        {
          name: "Mattwmaster58",
          github_username: "Mattwmaster58",
        },
      ],
      version: "0.0.1",
      description: "",
      github: "https://github.com/Mattwmaster58/BetterDiscordPlugins",
      github_raw: "https://raw.githubusercontent.com/Mattwmaster58/BetterDiscordPlugins/master/mathHelper.plugin.js",
    },
    changelog: [],
    main: "index.js",
  };

  return !global.ZeresPluginLibrary
    ? class {
      constructor() {
        this._config = config;
      }

      getName() {
        return config.info.name;
      }

      getAuthor() {
        return config.info.authors.map((a) => a.name).join(", ");
      }

      getDescription() {
        return config.info.description;
      }

      getVersion() {
        return config.info.version;
      }

      load() {
        const title = "Library Missing";
        const ModalStack = BdApi.findModuleByProps("push", "update", "pop", "popWithKey");
        const TextElement = BdApi.findModuleByProps("Sizes", "Weights");
        const ConfirmationModal = BdApi.findModule((m) => m.defaultProps && m.key && m.key() === "confirm-modal");
        if (!ModalStack || !ConfirmationModal || !TextElement)
          return BdApi.alert(
            title,
            `The library plugin needed for ${config.info.name} is missing.<br /><br /> <a href="https://betterdiscord.net/ghdl?url=https://raw.githubusercontent.com/rauenzi/BDPluginLibrary/master/release/0PluginLibrary.plugin.js" target="_blank">Click here to download the library!</a>`
          );
        ModalStack.push(function (props) {
          return BdApi.React.createElement(
            ConfirmationModal,
            Object.assign(
              {
                header: title,
                children: [
                  BdApi.React.createElement(TextElement, {
                    color: TextElement.Colors.PRIMARY,
                    children: [
                      `The library plugin needed for ${config.info.name} is missing. Please click Download Now to install it.`,
                    ],
                  }),
                ],
                red: false,
                confirmText: "Download Now",
                cancelText: "Cancel",
                onConfirm: () => {
                  require("request").get(
                    "https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js",
                    async (error, response, body) => {
                      if (error)
                        return require("electron").shell.openExternal(
                          "https://betterdiscord.net/ghdl?url=https://raw.githubusercontent.com/rauenzi/BDPluginLibrary/master/release/0PluginLibrary.plugin.js"
                        );
                      await new Promise((r) =>
                        require("fs").writeFile(
                          require("path").join(ContentManager.pluginsFolder, "0PluginLibrary.plugin.js"),
                          body,
                          r
                        )
                      );
                    }
                  );
                },
              },
              props
            )
          );
        });
      }

      start() {
      }

      stop() {
      }
    }
    : (([Plugin, Api]) => {
      const plugin = (Plugin, Library) => {
        const {Logger, DiscordModules, Patcher, Settings} = Library;

        return class MathHelper extends Plugin {
          constructor() {
            super();
            // prettier-ignore
            this.upperSmallCharMap = {0:"⁰",1:"¹",2:"²",3:"³",4:"⁴",5:"⁵",6:"⁶",7:"⁷",8:"⁸",9:"⁹",a:"ᵃ",b:"ᵇ",c:"ᶜ",d:"ᵈ",e:"ᵉ",f:"ᶠ",g:"ᵍ",h:"ʰ",i:"ⁱ",j:"ʲ",k:"ᵏ",l:"ˡ",m:"ᵐ",n:"ⁿ",o:"ᵒ",p:"ᵖ",q:"q",r:"ʳ",s:"ˢ",t:"ᵗ",u:"ᵘ",v:"ᵛ",w:"ʷ",x:"ˣ",y:"ʸ",z:"ᶻ",A:"ᴬ",B:"ᴮ",C:"ᶜ",D:"ᴰ",E:"ᴱ",F:"ᶠ",G:"ᴳ",H:"ᴴ",I:"ᴵ",J:"ᴶ",K:"ᴷ",L:"ᴸ",M:"ᴹ",N:"ᴺ",O:"ᴼ",P:"ᴾ",Q:"Q",R:"ᴿ",S:"ˢ",T:"ᵀ",U:"ᵁ",V:"ⱽ",W:"ᵂ",X:"ˣ",Y:"ʸ",Z:"ᶻ","+":"⁺","-":"⁻","=":"⁼","(":"⁽",")":"⁾"};//prettier-ignore
            this.lowerSmallCharMap = {"0":"₀","1":"₁","2":"₂","3":"₃","4":"₄","5":"₅","6":"₆","7":"₇","8":"₈","9":"₉","a":"ₐ","b":"b","e":"ₑ","f":"f","h":"ₕ","i":"ᵢ","j":"ⱼ","k":"ₖ","l":"ₗ","m":"ₘ","n":"ₙ","o":"ₒ","p":"ₚ","q":"q","r":"ᵣ","s":"ₛ","t":"ₜ","u":"ᵤ","v":"ᵥ","x":"ₓ","A":"ₐ","B":"B","C":"C","D":"D","E":"ₑ","F":"F","G":"G","H":"ₕ","I":"ᵢ","J":"ⱼ","K":"ₖ","L":"ₗ","M":"ₘ","N":"ₙ","O":"ₒ","P":"ₚ","Q":"Q","R":"ᵣ","S":"ₛ","T":"ₜ","U":"ᵤ","V":"ᵥ","W":"W","X":"ₓ","Y":"Y","Z":"Z","+":"₊","-":"₋","=":"₌","(":"₍",")":"₎","y":"ᵧ","z":"𝓏","w":"𝓌","c":"𝒸","d":"𝒹","g":"𝓰"};
            this.defaultSettings = {
              abcBase: true,
              abcSubscript: true,
              abcSuperscript: false,
            };
          }

          onStart() {
            Logger.log("Started patching sendMessage");
            Patcher.before(DiscordModules.MessageActions, "sendMessage", (t, a) => {
              let content = a[1].content;
              // as the prophecy fortells, if these regexes are ever coalesced into one,
              // they will never be able to be seperated by man, nor divine being, nor any incantation of git
              const bracedExpressionMathMatcher = /([\da-z]+)(?:_{(.*)}\^{(.*)}|(?:_{(.*)}|\^{(.*)}))/gmi
              const trivialMathMatcher = /([\da-z]+)(?:_(\d+)\^(\d+)|(?:_(\d+)|\^(\d+)))/gmi;
              let needToReassign = false;
              if (trivialMathMatcher.test(content)) {
                content = content.replace(trivialMathMatcher, this.processMathSub.bind(this));
                needToReassign = true;
              }
              if (bracedExpressionMathMatcher.test(content)) {
                content = content.replace(bracedExpressionMathMatcher, this.processMathSub.bind(this));
                needToReassign = true;
              }
              if (needToReassign) {
                a[1].content = content;
              }
            });
          }

          onStop() {
            Patcher.unpatchAll();
            Logger.log("Stopped patching sendMessage");
          }

          getSettingsPanel() {
            return Settings.SettingPanel.build(
              this.saveSettings.bind(this),
              new Settings.SettingGroup("MathHelper Settings", {
                collapsible: false,
                shown: true,
              }).append(
                new Settings.Switch(
                  "Disable in codeblocks",
                  "If on, substitutions will not be made within code blocks" +
                  " If off, the superscript may only be a number",
                  this.settings.abcSuperscript,
                  (e) => {
                    this.settings.abcSuperscript = e;
                  }
                ),
                new Settings.Switch(
                  "Arbitrary base",
                  "If on, the base of the expression may be any non-whitespace character." +
                  " If off, the base may only be a number. " +
                  "This setting applies to both inline and expanded forms (eg '5^{2}')",
                  this.settings.abcBase,
                  (e) => {
                    this.settings.abcBase = e;
                  }
                ),
                new Settings.Switch(
                  "Arbitrary subscript",
                  "If on, the subscript of the expression may be any non-whitespace character." +
                  " If off, the subscript may only be a number",
                  this.settings.abcSubscript,
                  (e) => {
                    this.settings.abcSubscript = e;
                  }
                ),
                new Settings.Switch(
                  "Arbitrary superscript",
                  "If on, the superscript of the expression may be any non-whitespace character." +
                  " If off, the superscript may only be a number",
                  this.settings.abcSuperscript,
                  (e) => {
                    this.settings.abcSuperscript = e;
                  }
                )
              )
            );
          }

          processMathSub(match, number, subscript, superscript, x_subcript, x_superscript) {
            return number +
              this.charMapSub(this.lowerSmallCharMap, x_subcript || subscript) +
              this.charMapSub(this.upperSmallCharMap, x_superscript || superscript);
          }

          charMapSub(cMap, text) {
            if (!text) {
              return "";
            }
            let out = "";
            for (let c of text.split("")) {
              out += cMap[c] || cMap[c.toLowerCase()] || c;
            }
            return out;
          }

          poorlyWrittenLexerMatchesInRange(content) {
            // please forgive me
            let contentArr = Array.from(content);
            let [quoteBounds, cBlockBounds, cSnippetBounds] = [[], [], []];
            let t = {dQuote: [], sQuote: [], cBlock: [], cSnippet: []};
            for (let i = 0; i < contentArr.length;) {
              if (contentArr[i] === '`') {
                if (contentArr.slice(i + 1, i + 3) === ['`', '`']) {
                  if (t.cBlock.length === 0) {
                    t.cBlock.push(i);
                  } else {
                    t.cBlock.push(i);
                    cBlockBounds.push(t.cBlock);
                    if (t.cBlock[0] < t.cSnippet[0]) {
                      t.cSnippet = [];
                    }
                    [t.cBlock, t.dQuote, t.sQuote] = [[], [], [], []];
                    i += 3
                    continue;
                  }
                } else {
                  if (t.cSnippet.length === 0) {
                    t.cSnippet.push(i);
                  } else {
                    t.cSnippet.push(i);
                    cSnippetBounds.push(t.cSnippet);
                    if (t.cSnippet[0] < t.cBlock[0]) {
                      t.cBlock = [];
                    }
                    [t.cSnippet, t.dQuote, t.sQuote] = [[], [], [], []];
                  }
                }
              }
              else if (contentArr[i] === "'") {
                if (t.sQuote.length === 0) {
                  t.sQuote.push(i);
                } else {
                  t.sQuote.push(i);
                  cSnippetBounds.push(t.sQuote);
                  if (t.sQuote[0] < t.cBlock[0]) {
                    t.cBlock = [];
                  }
                  [t.sQuote, t.dQuote, t.sQuote] = [[], [], [], []];
                }
              } else if (contentArr[i] === '"') {

              }
            }
          }
        };
      };
      return plugin(Plugin, Api);
    })(global.ZeresPluginLibrary.buildPlugin(config));
})();
/*@end@*/
