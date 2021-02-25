require(['gitbook', 'jQuery'], function (gitbook, $) {
    var TOGGLE_CLASSNAME = 'expanded',
        CHAPTER = '.chapter',
        ARTICLES = '.articles',
        TRIGGER_TEMPLATE = '<i class="exc-trigger fa"></i>',
        LS_NAMESPACE = 'expChapters';
    var init = function () {
        // adding the trigger element to each ARTICLES parent and binding the event
        $(ARTICLES)
            .parent(CHAPTER)
            .children('a,span')
            .append(
                $(TRIGGER_TEMPLATE)
                .on('click', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    toggle($(e.target).closest(CHAPTER));
                })
            );
        expand(lsItem());
        //expand current selected chapter with it's parents
        var activeChapter = $(CHAPTER + '.active');
        expand(activeChapter);
        expand(activeChapter.parents(CHAPTER));

        // サイドバーの表示幅を超える場合、ツールチップを追加
        $('ul.summary li>a').each(function (index, element) {
            let $e = $(element);
            let text = $e.text().trim();
            let $c = $e.clone().css({display: 'inline', width:'auto', visibility: 'hidden'}).appendTo('body');
            $c.removeClass('articles');
            $c.text(text);

            if ($c.width() >= Math.floor($e.width())) {
                $e.attr('title', text);
            }

            $c.remove();
        });

        // サイドバー操作パネル
        $('ul.summary').prepend(
            '<li id="collapse-control">' +
            '<span>目次:</span> ' +
            '<span id="expand-all"><i class="far fa-plus-square"></i></i> 全て開く</span>' +
            '&nbsp;' +
            '<span id="collapse-all"><i class="far fa-minus-square"></i> 全て閉じる</span>' +
            '<hr>' +
            '</li>'
        );
        // 全て開く
        $('#expand-all').on('click', function () {
            $('.chapter').each(function (index, chapter) {
                let $chapter = $(chapter);
                if (!$chapter.hasClass('expanded')) {
                    toggle($chapter);
                }
            });
        });
        // 全て閉じる
        $('#collapse-all').on('click', function () {
            $('.chapter').each(function (index, chapter) {
                let $chapter = $(chapter);
                if ($chapter.hasClass('expanded')) {
                    toggle($chapter);
                }
            });
        });
    }
    var toggle = function ($chapter) {
        if ($chapter.hasClass('expanded')) {
            collapse($chapter);
        } else {
            expand($chapter);
        }
    }
    var collapse = function ($chapter) {
        if ($chapter.length && $chapter.hasClass(TOGGLE_CLASSNAME)) {
            $chapter.removeClass(TOGGLE_CLASSNAME);
            lsItem($chapter);
        }
    }
    var expand = function ($chapter) {
        if ($chapter.length && !$chapter.hasClass(TOGGLE_CLASSNAME)) {
            $chapter.addClass(TOGGLE_CLASSNAME);
            lsItem($chapter);
        }
    }
    var lsItem = function () {
        var map = JSON.parse(localStorage.getItem(LS_NAMESPACE)) || {}
        if (arguments.length) {
            var $chapters = arguments[0];
            $chapters.each(function (index, element) {
                var level = $(this).data('level');
                var value = $(this).hasClass(TOGGLE_CLASSNAME);
                map[level] = value;
            })
            localStorage.setItem(LS_NAMESPACE, JSON.stringify(map));
        } else {
            return $(CHAPTER).map(function (index, element) {
                if (map[$(this).data('level')]) {
                    return this;
                }
            })
        }
    }
    gitbook.events.bind('page.change', function () {
        init()
    });
});
