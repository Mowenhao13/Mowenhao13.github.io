(function () {
  'use strict';

  // ============================================================
  // 配置
  // ============================================================
  var CONFIG = {
    owner: 'Mowenhao13',
    repo: 'Mowenhao13.github.io',
    branch: 'main',
    PAT_KEY: 'write_editor_github_pat'
  };

  // ============================================================
  // DOM 引用
  // ============================================================
  var $ = function (id) { return document.getElementById(id); };

  var editorEl = $('editor');
  var titleInput = $('post-title');
  var categorySelect = $('post-category');
  var tagsInput = $('post-tags');
  var btnSave = $('btn-save');
  var btnTogglePreview = $('btn-toggle-preview');
  var saveStatus = $('save-status');
  var patModal = $('pat-modal');
  var patInput = $('pat-input');
  var btnPatSave = $('btn-pat-save');
  var btnPatClear = $('btn-pat-clear');
  var patStatus = $('pat-status');

  var editor;

  // ============================================================
  // 工具函数
  // ============================================================

  /** 获取 GitHub Token */
  function getToken() {
    return localStorage.getItem(CONFIG.PAT_KEY) || '';
  }

  /** 保存 Token */
  function saveToken(token) {
    localStorage.setItem(CONFIG.PAT_KEY, token);
  }

  /** 清除 Token */
  function clearToken() {
    localStorage.removeItem(CONFIG.PAT_KEY);
  }

  /** 字符串转 slug */
  function slugify(text) {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/[\s]+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
  }

  /** 获取当前日期 YYYY-MM-DD */
  function todayStr() {
    var d = new Date();
    var pad = function (n) { return n < 10 ? '0' + n : '' + n; };
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  }

  /** 生成 YAML front matter */
  function buildFrontMatter(title, category, tags) {
    var lines = ['---'];
    lines.push('layout: post');
    if (category) {
      lines.push('categories: ' + category);
    }
    lines.push('title: ' + title);
    var tagArr = tags
      .split(',')
      .map(function (t) { return t.trim(); })
      .filter(function (t) { return t.length > 0; });
    if (tagArr.length > 0) {
      lines.push('tags:');
      tagArr.forEach(function (t) {
        lines.push('  - ' + t);
      });
    }
    lines.push('---');
    lines.push('');
    return lines.join('\n');
  }

  /** 显示状态消息 */
  function showStatus(msg, type) {
    saveStatus.textContent = msg;
    saveStatus.className = 'save-status visible status-' + (type || 'info');
    if (type !== 'loading') {
      setTimeout(function () {
        saveStatus.className = 'save-status hidden';
      }, 6000);
    }
  }

  /** 显示模态框 */
  function showPatModal() {
    patModal.className = 'modal visible';
    patInput.value = getToken() || '';
    patStatus.textContent = '';
  }

  /** 隐藏模态框 */
  function hidePatModal() {
    patModal.className = 'modal hidden';
  }

  // ============================================================
  // GitHub API 调用
  // ============================================================

  /**
   * 通过 GitHub Content API 创建文件
   * PUT /repos/{owner}/{repo}/contents/{path}
   */
  function createFileOnGitHub(path, content, token, message) {
    var encoded = btoa(unescape(encodeURIComponent(content)));

    return fetch('https://api.github.com/repos/' + CONFIG.owner + '/' + CONFIG.repo + '/contents/' + path, {
      method: 'PUT',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Accept': 'application/vnd.github+json',
        'Content-Type': 'application/json',
        'X-GitHub-Api-Version': '2022-11-28'
      },
      body: JSON.stringify({
        message: message || 'Add post: ' + path.split('/').pop(),
        content: encoded,
        branch: CONFIG.branch
      })
    });
  }

  /**
   * 检查文件是否存在（用于更新场景）
   */
  function getFileSha(path, token) {
    return fetch('https://api.github.com/repos/' + CONFIG.owner + '/' + CONFIG.repo + '/contents/' + path, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Accept': 'application/vnd.github+json'
      }
    }).then(function (res) {
      if (res.status === 200) {
        return res.json().then(function (data) { return data.sha; });
      }
      return null;
    });
  }

  // ============================================================
  // 保存文章
  // ============================================================

  function handleSave() {
    var token = getToken();

    // 检查是否有 Token
    if (!token) {
      showPatModal();
      return;
    }

    var title = titleInput.value.trim();
    if (!title) {
      showStatus('请填写文章标题', 'error');
      titleInput.focus();
      return;
    }

    var category = categorySelect.value;
    var tags = tagsInput.value.trim();
    var markdownContent = editor.getMarkdown();

    if (!markdownContent.trim()) {
      showStatus('请填写文章内容', 'error');
      return;
    }

    var slug = slugify(title);
    var date = todayStr();
    var filename = date + '-' + slug + '.md';
    var filePath = category + '/_posts/' + filename;

    var fullContent = buildFrontMatter(title, category, tags) + markdownContent;

    showStatus('正在保存到 GitHub...', 'loading');
    btnSave.disabled = true;

    createFileOnGitHub(filePath, fullContent, token, 'Add post: ' + title)
      .then(function (res) {
        if (!res.ok) {
          return res.json().then(function (err) {
            // 403 可能 Token 无效
            if (res.status === 401 || res.status === 403) {
              showStatus('认证失败，请检查 Token', 'error');
              return null;
            }
            throw new Error(err.message || '保存失败');
          });
        }
        var previewUrl = '/' + category + '/' + slug;
        showStatus(
          '✅ 文章已保存！<a href="' + previewUrl + '" target="_blank">查看新文章</a>（构建完成后可见）',
          'success'
        );
        // 清空编辑器供下次使用
        editor.setMarkdown('');
        titleInput.value = '';
        tagsInput.value = '';
        return res.json();
      })
      .catch(function (err) {
        showStatus('❌ 保存失败：' + err.message, 'error');
      })
      .finally(function () {
        btnSave.disabled = false;
      });
  }

  // ============================================================
  // PAT 模态框
  // ============================================================

  btnPatSave.addEventListener('click', function () {
    var token = patInput.value.trim();
    if (!token) {
      patStatus.textContent = '请输入 Token';
      patStatus.className = 'pat-status pat-error';
      return;
    }
    if (!token.startsWith('github_pat_') && !token.startsWith('ghp_')) {
      patStatus.textContent = 'Token 格式不正确，应以 github_pat_ 或 ghp_ 开头';
      patStatus.className = 'pat-status pat-error';
      return;
    }
    saveToken(token);
    patStatus.textContent = 'Token 已保存';
    patStatus.className = 'pat-status pat-success';
    hidePatModal();
    showStatus('Token 已保存，可以开始写作了', 'success');
  });

  btnPatClear.addEventListener('click', function () {
    clearToken();
    patInput.value = '';
    patStatus.textContent = 'Token 已清除';
    patStatus.className = 'pat-status pat-success';
  });

  // ============================================================
  // 切换预览模式（竖向 / 分栏 / 全屏预览）
  // ============================================================

  var previewModes = ['vertical', 'tab', 'wysiwyg'];
  var previewLabels = ['分栏', '预览', '所见即所得'];
  var previewIndex = 0;

  function togglePreviewMode() {
    previewIndex = (previewIndex + 1) % previewModes.length;
    var mode = previewModes[previewIndex];
    editor.changePreviewStyle(mode === 'tab' ? 'vertical' : mode);
    if (mode === 'wysiwyg') {
      editor.changeMode('wysiwyg');
    } else {
      editor.changeMode('markdown');
    }
    btnTogglePreview.textContent = previewLabels[previewIndex];
  }

  // ============================================================
  // 初始化
  // ============================================================

  function init() {
    // 初始化 toast-ui Editor
    editor = new toastui.Editor({
      el: editorEl,
      height: '600px',
      initialEditType: 'markdown',
      previewStyle: 'vertical',
      initialValue: '开始写作吧...\n\n用 Markdown 格式编写文章内容。',
      usageStatistics: false,
      hideModeSwitch: true,
      toolbarItems: [
        ['heading', 'bold', 'italic', 'strike'],
        ['hr', 'quote'],
        ['ul', 'ol', 'task'],
        ['table', 'link'],
        ['code', 'codeblock']
      ]
    });

    // 保存按钮
    btnSave.addEventListener('click', handleSave);

    // 切换预览模式
    btnTogglePreview.addEventListener('click', togglePreviewMode);

    // 快捷键 Ctrl/Cmd + Enter 保存
    document.addEventListener('keydown', function (e) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();
        handleSave();
      }
    });

    // 如果还没有 Token，弹出设置
    if (!getToken()) {
      setTimeout(showPatModal, 500);
    }
  }

  // 等页面加载完成再初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();