# 苏青淮的个人主页

纯静态个人主页，不用框架、不用构建，推到 GitHub Pages 就能跑，也方便绑定自己的域名。

- 首页：个人介绍、头像、三个数字看板（7000+ 远程协助 / 92% 好评 / 大四在读）
- 关于我：个人介绍、想说的话、爱好（电子、天文、摄影、3D 打印）
- 工作履历：老师、家教、房产中介、保安、外卖骑手、自主创业、网店、自媒体、技术协助
- 成果展示：项目清单 + 可接的服务 + 交付流程，支持按类别筛选
- 联系方式：邮箱、微信等渠道，留言表单会拉起本地邮件客户端

## 目录结构

```
.
├── index.html          首页
├── about.html          关于我
├── experience.html     工作履历
├── projects.html       成果展示
├── contact.html        联系方式
├── 404.html            自定义错误页
├── .nojekyll           告诉 GitHub Pages 不要跑 Jekyll
├── assets/
│   ├── style.css       全部样式
│   └── main.js         筛选、留言表单、页脚年份
├── media/              图片
│   └── 头像.jpg         头像
└── README.md
```

## 本地预览

直接双击 `index.html` 就能看。想更接近线上效果，用任意一个本地服务器：

```powershell
python -m http.server 8000
```

然后打开 <http://localhost:8000>。

## 上线：GitHub Pages

1. 新建一个 **public** 仓库，把本目录内容推到 `main` 分支（`index.html` 要在仓库根目录）。
2. 仓库 **Settings → Pages**，Source 选 **Deploy from a branch**，分支选 `main`、目录选 `/ (root)`，保存。
3. 等一两分钟，访问 `https://<用户名>.github.io/<仓库名>/`。
   - 如果仓库名是 `<用户名>.github.io`，地址就是 `https://<用户名>.github.io/`。

## 绑定自己的域名

假设域名是 `example.com`，想把 `www.example.com` 作为主地址：

1. **先在 DNS 服务商加解析**（生效前不要急着填域名，否则 GitHub 校验会失败）：
   - `www` → CNAME → `<用户名>.github.io`
   - `@`（根域名）→ A 记录，四条都要加：
     - `185.199.108.153`
     - `185.199.109.153`
     - `185.199.110.153`
     - `185.199.111.153`
2. 仓库 **Settings → Pages → Custom domain**，填 `www.example.com`，保存。仓库里会自动生成一个 `CNAME` 文件，不要删。
3. 等 DNS 生效（几分钟到 24 小时），回到同一个页面，勾上 **Enforce HTTPS**。证书签发可能要再等几分钟到一小时。
4. 访问 `https://www.example.com` 确认能打开；根域名 `example.com` 会自动跳过来。

几点提醒：

- 自定义域名生效后，站点就在域名根路径下，页面里的相对链接不受影响。
- 如果以后要在**中国大陆**长期正经使用这个域名，域名需要备案；GitHub Pages 的服务器在境外，国内访问速度一般。只想给自己和同行看，不备案也能用。
- 想撤掉域名绑定，删掉仓库里的 `CNAME` 文件、清空 Custom domain 即可。

## 上线前要替换的内容

| 位置 | 现在是什么 | 换成什么 |
| --- | --- | --- |
| `media/头像.jpg` | 现在的头像（853×853） | 想换就同名覆盖，或换成别的文件名并改 `index.html` 里的 `src` |
| `contact.html` | 邮箱、微信已填；GitHub / B站 / 小红书 / QQ 仍是「待填写」 | 补上其余渠道，或删掉那几行 |
| `assets/main.js` | 顶部 `CONTACT_EMAIL` 常量 | 已改成 `430615396@qq.com`，换邮箱时同步改这里 |
| `projects.html` | 7 条示例项目 | 换成你真实做过的项目：名字、一句话、技术栈 |
| `experience.html` | 四类履历，没写年份 | 补上起止年份；有具体单位也可以加 |
| `index.html` | 「最近在做」三条 | 按你现在的状态改 |

微信二维码可以放在 `media/wechat-qr.png`，在 `contact.html` 的微信那一行插一个 `<img>` 就行。

## 其他说明

- 中文字体（思源宋体）从 jsDelivr 加载，加载不到时会自动回落到系统宋体，不影响阅读。
- 页面里的数字（7000 次、92%）来自你提供的信息，改的时候记得几处同时改：首页读数带、关于我、履历、成果页。
- 全部是手写 HTML/CSS，没有依赖库，也没有构建步骤，改文案直接用编辑器打开对应文件就行。
