---
layout: page
title: 写文章
permalink: /write/
custom_head: |
  <link rel="stylesheet" href="/assets/write-editor/toastui/toastui-editor.css">
  <link rel="stylesheet" href="/assets/write-editor/write.css">
custom_js:
  - /assets/write-editor/toastui/toastui-editor.js
  - /assets/write-editor/write.js
---
<div id="editor-toolbar">
  <div class="editor-meta">
    <input type="text" id="post-title" placeholder="文章标题" class="meta-input title-input" />
    <select id="post-category" class="meta-input category-select">
      <option value="general">一般</option>
      <option value="literature">文学</option>
    </select>
    <input type="text" id="post-tags" placeholder="标签（逗号分隔）" class="meta-input tags-input" />
  </div>
  <div class="editor-actions">
    <button id="btn-save" class="editor-btn btn-primary">保存到 GitHub</button>
    <button id="btn-toggle-preview" class="editor-btn btn-secondary">切换预览模式</button>
  </div>
</div>

<div id="editor"></div>

<div id="save-status" class="save-status hidden"></div>

<div id="pat-modal" class="modal hidden">
  <div class="modal-content">
    <h3>GitHub 认证</h3>
    <p>首次使用时，请输入你的 GitHub Personal Access Token：</p>
    <p class="pat-help">
      在 <a href="https://github.com/settings/tokens?type=beta" target="_blank">GitHub 设置页面</a>
      创建一个 fine-grained token，权限选择 <code>Contents: Read and write</code>，并选择你的仓库。
    </p>
    <input type="password" id="pat-input" placeholder="ghp_xxxxxxxxxxxxxxxxxxxx" class="pat-input" />
    <div class="modal-actions">
      <button id="btn-pat-save" class="editor-btn btn-primary">保存</button>
      <button id="btn-pat-clear" class="editor-btn btn-danger">清除 Token</button>
    </div>
    <p id="pat-status" class="pat-status"></p>
  </div>
</div>