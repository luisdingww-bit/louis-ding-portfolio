# Louis Ding · 个人作品集 / Portfolio

> 建筑 × AI × 数字制造（Architecture × AI × Digital Fabrication）的个人作品集与博客站点。

**Live site / 线上地址：** https://luisdingww-bit.github.io/louis-ding-portfolio/

## 简介 / About

我是丁俊晖（Louis Ding），华侨大学建筑学专业，专注于人工智能辅助建筑设计、计算性设计与数字制造的交叉领域。本站点用于展示作品、记录学习笔记，并介绍我的产品 SnapPrint® 咔印3D。

## 功能 / Features

- **中英双语**：顶部导航栏一键切换 中 / EN，语言偏好本地保存。
- **关于我**：独立站内页，展示个人资料（姓名 / 学校 / 专业 / 方向 / 所在地）。
- **画廊**：独立站内页，含「个人作品」与「个人照片」两个标签页，支持本地上传与删除。
- **博客 / 文章记录**：独立站内页，网页内通过「+」即可新增、编辑、删除文章（标题、日期、封面、摘要、正文），数据存于浏览器。
- **SnapPrint 展示区**：暗色 Hero 风格展示，含真实 CRT 头视频、鼠标追踪眼罩光晕与噪点滤镜。
- **响应式 + 滚动动画**：基于 IntersectionObserver 的渐入效果。
- **一键部署**：推送 `main` 即由 GitHub Pages Actions 自动构建发布。

## 技术栈 / Tech Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS
- lucide-react（图标）

## 本地运行 / Local Development

```bash
npm install      # 安装依赖
npm run dev      # 本地开发服务器（默认 http://localhost:5173）
npm run build    # 类型检查 + 生产构建（输出到 dist/）
npm run preview  # 本地预览构建产物
```

> 部署到 GitHub Pages 时，`npm run build` 前需设置环境变量 `PAGES=true`（CI 中已自动处理），用于切换资源 `base` 路径。

## 部署 / Deploy

项目通过 `.github/workflows/deploy.yml` 在每次推送到 `main` 时自动：
1. `npm ci` 安装依赖；
2. `npm run build` 构建；
3. 发布至 GitHub Pages。

## 目录结构 / Structure（节选）

```
src/
  App.tsx                  # 入口，视图切换（home / blog / gallery / about）
  i18n.tsx                 # 中英双语字典与 LanguageProvider
  constants.ts             # 作品图、WhatsApp 链接等常量
  components/
    TopNav.tsx             # 顶部导航 + 语言切换
    Hero / ExpertiseSection / PartnerSection
    RetroHead.tsx          # SnapPrint 交互展示区
    AboutView.tsx          # 关于我
    GalleryView.tsx        # 画廊（作品 / 照片）
    BlogView.tsx           # 博客（文章记录）
    Footer.tsx / CopyrightBar.tsx
public/
  retro-head.mp4           # CRT 头视频
  pdf_01~09.jpeg           # 建筑作品图
  louis-ding.jpg           # 个人照
```

## 联系方式 / Contact

- GitHub: [@luisdingww-bit](https://github.com/luisdingww-bit)
- Gmail: luisdingww@gmail.com
- WeChat: louis__heree
- WhatsApp: [+86 18050020614](https://wa.me/8618050020614)

## 许可 / License

[MIT](./LICENSE) © 2026 Louis Ding (丁俊晖)
