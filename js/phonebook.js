// ============================================
// 分機查詢系統 - 共用功能
// ============================================

/**
 * 正規化文字：NFKC 正規化 + 移除空白 + 轉小寫
 */
function normalizeText(str) {
  return (str || '').normalize('NFKC').replace(/\s+/g, '').toLowerCase();
}

/**
 * 將關鍵字轉為模糊比對用的正則表達式
 */
function fuzzyRegex(str) {
  if (!str) return null;
  const chars = normalizeText(str).split('');
  return chars.length ? new RegExp(chars.join('.*'), 'i') : null;
}

/**
 * 匯出 CSV 檔案
 * @param {Array} data - 包含表頭列的完整資料陣列
 * @param {string} filename - 下載的檔名
 */
function exportCSV(data, filename) {
  const csv = data
    .map(r => r.map(v => `"${(v ?? '').toString().replace(/"/g, '""')}"`).join(','))
    .join('\n');

  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csv], { type: 'text/csv;charset=utf-8;' });

  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
}

/**
 * 列印表格
 */
function printTable() {
  window.print();
}

/**
 * 初始化分機查詢系統
 * @param {Object} options - 設定選項
 * @param {Array} options.data - PHONEBOOK_DATA 原始資料（含表頭）
 * @param {string} options.csvFilename - CSV 匯出檔名
 * @param {boolean} [options.searchRoom=false] - 是否將教室編號納入搜尋範圍
 */
function initPhonebook(options) {
  const { data, csvFilename, searchRoom = false } = options;

  // ----- 資料處理 -----
  const rows = data.slice(1).map(r => ({
    部門: r[0],
    姓名: r[1],
    分機: r[2],
    教室編號: r[3]
  }));

  // ----- DOM 元素 -----
  const searchInput = document.getElementById('search');
  const deptFilter = document.getElementById('deptFilter');
  const tbody = document.getElementById('tbody');
  const emptyDiv = document.getElementById('empty');
  const countDiv = document.getElementById('count');
  const resultWrap = document.getElementById('resultWrap');

  // ----- 建立部門篩選選單 -----
  [...new Set(rows.map(r => r.部門).filter(Boolean))]
    .sort((a, b) => a.localeCompare(b, 'zh-Hant-TW'))
    .forEach(d => {
      const o = document.createElement('option');
      o.value = o.textContent = d;
      deptFilter.appendChild(o);
    });

  // ----- 渲染函式 -----
  function render() {
    const kwRaw = searchInput.value.trim();
    const dept = deptFilter.value;

    // 永遠顯示結果區
    resultWrap.style.display = 'block';

    const regex = fuzzyRegex(kwRaw);
    const isNumeric = /^[0-9]+$/.test(kwRaw);

    const filtered = rows.filter(r => {
      if (dept && r.部門 !== dept) return false;
      if (!kwRaw) return true;

      // 決定搜尋範圍：部門 + 姓名（可選 + 教室編號）
      let textHay = normalizeText(r.部門 + r.姓名);
      if (searchRoom) {
        textHay = normalizeText((r.部門 || '') + (r.姓名 || '') + (r.教室編號 || ''));
      }

      if (isNumeric) {
        const matchExt = r.分機 && r.分機.toString().includes(kwRaw);
        const matchText = textHay.includes(normalizeText(kwRaw));
        return matchExt || matchText;
      }

      return regex
        ? regex.test(textHay)
        : textHay.includes(normalizeText(kwRaw));
    });

    tbody.innerHTML = '';
    if (filtered.length === 0) {
      emptyDiv.style.display = 'block';
      countDiv.textContent = '共 0 筆';
      return;
    }

    emptyDiv.style.display = 'none';
    countDiv.innerHTML = `共 <span class="highlight">${filtered.length}</span> 筆`;

    filtered.forEach(r => {
      tbody.innerHTML += `<tr>
        <td>${r.部門}</td>
        <td>${r.姓名}</td>
        <td>${r.分機}</td>
        <td>${r.教室編號}</td>
      </tr>`;
    });
  }

  // ----- 事件綁定 -----
  searchInput.addEventListener('input', render);
  deptFilter.addEventListener('change', render);

  // ----- 掛載到全域供按鈕呼叫 -----
  window.exportCSV = function () {
    exportCSV(data, csvFilename);
  };
  window.printTable = printTable;

  // ----- 初次渲染 -----
  render();
}
