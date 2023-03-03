'use strict';


interface tagFilter{
    [x: string]: (el: any, options: any) => void;
    
}


define('tagFilter', ['tagSearch', 'api', 'hooks'], function (tagSearch, api, hooks) {
    const tagFilter : tagFilter = {};

    tagFilter.init = function (el, options) {
        if (!el || !el.length) {
            return;
        }
        options = options || {};
        options.states = options.states || ['watching', 'notwatching', 'ignoring'];
        options.template = 'partials/tags-filter';

        hooks.fire('action:category.filter.options', { el: el, options: options });

        tagSearch.init(el, options);

        let selectedTids = [];
        let initialTids = [];
        if (Array.isArray(options.selectedCids)) {
            selectedTids = options.selectedCids.map(cid => parseInt(cid, 10));
        } else if (Array.isArray(ajaxify.data.selectedCids)) {
            selectedTids = ajaxify.data.selectedCids.map(cid => parseInt(cid, 10));
        }
        initialTids = selectedTids.slice();

        el.on('hidden.bs.dropdown', function () {
            let changed = initialTids.length !== selectedTids.length;
            initialTids.forEach(function (tid, index) {
                if (tid !== selectedTids[index]) {
                    changed = true;
                }
            });
            if (changed) {
                updateFilterButton(el, selectedTids);
            }
            if (options.onHidden) {
                options.onHidden({ changed: changed, selectedCids: selectedTids.slice() });
                return;
            }
            if (changed) {
                let url = window.location.pathname;
                const currentParams = utils.params();
                if (selectedTids.length) {
                    currentParams.tid = selectedTids;
                    url += '?' + decodeURIComponent($.param(currentParams));
                }
                ajaxify.go(url);
            }
        });

        el.on('click', '[component="category/list"] [data-cid]', function () {
            const listEl = el.find('[component="category/list"]');
            const categoryEl = $(this);
            const link = categoryEl.find('a').attr('href');
            if (link && link !== '#' && link.length) {
                return;
            }
            const cid = parseInt(categoryEl.attr('data-cid'), 10);
            const icon = categoryEl.find('[component="category/select/icon"]');

            if (selectedTids.includes(cid)) {
                selectedTids.splice(selectedTids.indexOf(cid), 1);
            } else {
                selectedTids.push(cid);
            }
            selectedTids.sort(function (a, b) {
                return a - b;
            });
            options.selectedTids = selectedTids;

            icon.toggleClass('invisible');
            listEl.find('li[data-all="all"] i').toggleClass('invisible', !!selectedTids.length);
            if (options.onSelect) {
                options.onSelect({ cid: cid, selectedTids: selectedTids.slice() });
            }
            return false;
        });
    };

    function updateFilterButton(el, selectedTids) {
        if (selectedTids.length > 1) {
            renderButton({
                icon: 'fa-plus',
                name: '[[unread:multiple-categories-selected]]',
                bgColor: '#ddd',
            });
        } else if (selectedTids.length === 1) {
            api.get(`/categories/${selectedTids[0]}`, {}).then(renderButton);
        } else {
            renderButton();
        }
        function renderButton(tag) {
            app.parseAndTranslate('partials/category-filter-content', {
                selectedTag: tag,
            }, function (html) {
                el.find('button').replaceWith($('<div/>').html(html).find('button'));
            });
        }
    }

    return tagFilter;
});
function define(arg0: string, arg1: string[], arg2: (categorySearch: any, api: any, hooks: any) => {}) {
    throw new Error("Function not implemented.");
}

