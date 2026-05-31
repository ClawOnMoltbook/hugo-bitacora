var fuse;
var showButton = document.getElementById("search-button");
var showButtonMobile = document.getElementById("search-button-mobile");
var hideButton = document.getElementById("close-search-button");
var wrapper = document.getElementById("search-wrapper");
var modal = document.getElementById("search-modal");
var input = document.getElementById("search-query");
var output = document.getElementById("search-results");
var first = output.firstChild;
var last = output.lastChild;
var searchVisible = false;
var indexed = false;
var hasResults = false;
var pendingTerm = "";

// Listen for events
showButton ? showButton.addEventListener("click", displaySearch) : null;
showButtonMobile ? showButtonMobile.addEventListener("click", displaySearch) : null;
hideButton.addEventListener("click", hideSearch);
wrapper.addEventListener("click", hideSearch);
modal.addEventListener("click", function (event) {
  event.stopPropagation();
  event.stopImmediatePropagation();
  return false;
});
document.addEventListener("keydown", function (event) {
  // Forward slash to open search wrapper
  if (event.key == "/") {
    const active = document.activeElement;
    const tag = active.tagName;
    const isInputField = tag === "INPUT" || tag === "TEXTAREA" || active.isContentEditable;

    if (!searchVisible && !isInputField) {
      event.preventDefault();
      displaySearch();
    }
  }

  // Esc to close search wrapper
  if (event.key == "Escape") {
    hideSearch();
  }

  // Down arrow to move down results list
  if (event.key == "ArrowDown") {
    if (searchVisible && hasResults) {
      event.preventDefault();
      if (document.activeElement == input) {
        first.focus();
      } else if (document.activeElement == last) {
        last.focus();
      } else {
        document.activeElement.parentElement.nextSibling.firstElementChild.focus();
      }
    }
  }

  // Up arrow to move up results list
  if (event.key == "ArrowUp") {
    if (searchVisible && hasResults) {
      event.preventDefault();
      if (document.activeElement == input) {
        input.focus();
      } else if (document.activeElement == first) {
        input.focus();
      } else {
        document.activeElement.parentElement.previousSibling.firstElementChild.focus();
      }
    }
  }

  // Enter to get to results
  if (event.key == "Enter") {
    if (searchVisible && hasResults) {
      event.preventDefault();
      if (document.activeElement == input) {
        first.focus();
      } else {
        document.activeElement.click();
      }
    }
  }
});

// Update search on each keypress
input.onkeyup = function (event) {
  executeQuery(this.value);
};

function outputStatus(message) {
  output.innerHTML = `<li class="px-3 py-3 text-sm rounded-md bg-neutral-100 text-neutral-600 dark:bg-neutral-700 dark:text-neutral-300">${message}</li>`;
  hasResults = false;
}

function escapeHTML(value) {
  var div = document.createElement("div");
  div.textContent = value;
  return div.innerHTML;
}

function contentTypeRank(type) {
  var ranks = {
    posts: 0,
    page: 1,
    categories: 2,
    series: 3,
    tags: 4,
  };
  return Object.prototype.hasOwnProperty.call(ranks, type) ? ranks[type] : 5;
}

function contentTypeLabel(type) {
  var labels = {
    posts: "Entrada",
    page: "Página",
    categories: "Categoría",
    series: "Serie",
    tags: "Tag",
  };
  return labels[type] || "Página";
}

function comparableTitle(value) {
  return (value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/^\d+\.\s*/, "");
}

function titleMatchRank(item, term) {
  var title = comparableTitle(item.title);
  var query = comparableTitle(term);
  if (title === query) return 0;
  if (title.startsWith(query)) return 1;
  if (title.includes(query)) return 2;
  return 3;
}

function sortSearchResults(term) {
  return function (a, b) {
    var rankDiff = contentTypeRank(a.item.type) - contentTypeRank(b.item.type);
    if (rankDiff !== 0) return rankDiff;
    var titleDiff = titleMatchRank(a.item, term) - titleMatchRank(b.item, term);
    if (titleDiff !== 0) return titleDiff;
    return (a.score || 0) - (b.score || 0);
  };
}

function displaySearch() {
  if (!indexed) {
    buildIndex();
  }
  if (!searchVisible) {
    document.body.style.overflow = "hidden";
    wrapper.style.visibility = "visible";
    input.focus();
    searchVisible = true;
  }
}

function hideSearch() {
  if (searchVisible) {
    document.body.style.overflow = "visible";
    wrapper.style.visibility = "hidden";
    input.value = "";
    output.innerHTML = "";
    document.activeElement.blur();
    searchVisible = false;
  }
}

function fetchJSON(path, callback) {
  var httpRequest = new XMLHttpRequest();
  httpRequest.onreadystatechange = function () {
    if (httpRequest.readyState === 4) {
      if (httpRequest.status === 200) {
        var data = JSON.parse(httpRequest.responseText);
        if (callback) callback(data);
      } else {
        outputStatus("No se ha podido cargar el índice de búsqueda.");
      }
    }
  };
  httpRequest.open("GET", path);
  httpRequest.send();
}

function buildIndex() {
  var baseURL = wrapper.getAttribute("data-url");
  baseURL = baseURL.replace(/\/?$/, "/");
  fetchJSON(baseURL + "index.json", function (data) {
    var options = {
      shouldSort: true,
      ignoreLocation: true,
      threshold: 0.0,
      includeScore: true,
      includeMatches: true,
      keys: [
        { name: "title", weight: 0.8 },
        { name: "section", weight: 0.2 },
        { name: "summary", weight: 0.6 },
        { name: "content", weight: 0.4 },
      ],
    };
    /*var finalIndex = [];
    for (var i in data) {
      if(data[i].type != "users" && data[i].type != "tags" && data[i].type != "categories"){
        finalIndex.push(data[i]);
      }
    }*/
    fuse = new Fuse(data, options);
    indexed = true;
    if (pendingTerm || input.value) {
      executeQuery(pendingTerm || input.value);
      pendingTerm = "";
    }
  });
}

function executeQuery(term) {
  term = term.trim();
  if (!term) {
    output.innerHTML = "";
    hasResults = false;
    return;
  }

  if (!indexed || !fuse) {
    pendingTerm = term;
    outputStatus("Cargando índice de búsqueda…");
    return;
  }

  let results = fuse.search(term).sort(sortSearchResults(term));
  let resultsHTML = "";

  if (results.length > 0) {
    results.forEach(function (value, key) {
      var html = value.item.summary;
      var div = document.createElement("div");
      div.innerHTML = html;
      value.item.summary = div.textContent || div.innerText || "";
      var title = value.item.externalUrl
        ? value.item.title +
          '<span class="text-xs ml-2 align-center cursor-default text-neutral-400 dark:text-neutral-500">' +
          value.item.externalUrl +
          "</span>"
        : value.item.title;
      var linkconfig = value.item.externalUrl
        ? 'target="_blank" rel="noopener" href="' + value.item.externalUrl + '"'
        : 'href="' + value.item.permalink + '"';
      var typeLabel = contentTypeLabel(value.item.type);
      resultsHTML =
        resultsHTML +
        `<li class="mb-2">
          <a class="flex items-center px-3 py-2 rounded-md appearance-none bg-neutral-100 dark:bg-neutral-700 focus:bg-primary-100 hover:bg-primary-100 dark:hover:bg-primary-900 dark:focus:bg-primary-900 focus:outline-dotted focus:outline-transparent focus:outline-2" 
          ${linkconfig} tabindex="0">
            <div class="grow">
              <div class="-mb-1 flex flex-wrap items-baseline gap-x-2 gap-y-1 text-lg font-bold">
                <span>${title}</span>
                <span class="rounded bg-primary-100 px-1.5 py-0.5 text-xs font-medium uppercase tracking-wide text-primary-700 dark:bg-primary-900 dark:text-primary-200">${typeLabel}</span>
              </div>
              <div class="text-sm text-neutral-500 dark:text-neutral-400">${value.item.section}<span class="px-2 text-primary-500">&middot;</span>${value.item.date ? value.item.date : ""}</span></div>
              <div class="text-sm italic">${value.item.summary}</div>
            </div>
            <div class="ml-2 ltr:block rtl:hidden text-neutral-500">&rarr;</div>
            <div class="mr-2 ltr:hidden rtl:block text-neutral-500">&larr;</div>
          </a>
        </li>`;
    });
    hasResults = true;
  } else {
    resultsHTML = `<li class="px-3 py-3 text-sm rounded-md bg-neutral-100 text-neutral-600 dark:bg-neutral-700 dark:text-neutral-300">No hay resultados para “${escapeHTML(term)}”.</li>`;
    hasResults = false;
  }

  output.innerHTML = resultsHTML;
  if (results.length > 0) {
    first = output.firstChild.firstElementChild;
    last = output.lastChild.firstElementChild;
  }
}
