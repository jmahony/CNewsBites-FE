/*global $:false */
/*global jQuery:false */
/*global Mustache:false */
/*global Simrou:false */
/*global Spinner:false */
"use strict";

window.cnews = window.cnews || {};

window.cnews.api                 = "http://api.cnewsbit.es:8080/CNewsBites-API/webapi/myresource";
window.cnews.newsArticleTemplate = $("#news-story-template").html();
window.cnews.$main               = $("#js-main");

/********************* Setup and Routes *********************/
(function($, Simrou, NProgress, document, window, undefined) {

    var storyDraw = new StoryDraw();

    var router = new Simrou();

    var storyRoute = router.addRoute("/story/:query");

    storyRoute.get(function(event, params) {
        
        NProgress.start();

        var story = new Story(params.query);

        story.fetchArticles();

    });

    router.start();

})(jQuery, Simrou, NProgress, document, window);

/********************* Story Object *********************/
function Story(query) {

    this.title = "Test";
    this.query = query;
    this.articles = [];

    this.fetchArticles = function() {

        spinner(true);

        $.ajax({
            url: window.cnews.api,
            type: "GET",
            dataType: "json",
            data: {query: this.query},
            crossDomain: true,
            context: this,
            success: function(data, textStatus, jqXHR) {

                var date = null;

                for (var i = 0; i < data.length; i++) {

                    if (data[i].date == date) {
                        data[i].hideDate = true;
                    } else {
                        if (i != 0) {
                            data[i-1].endOfGroup = true;
                        }
                        data[i].startOfGroup = true;
                        date = data[i].date;
                    }

                    var day = moment(data[i].date);

                    data[i].formattedDate = day.format("ddd, MMM Do YYYY");

                }

                data[data.length-1].endOfGroup = true;
                this.articles = data;
                this.render();
                NProgress.done();
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log("Failed to load news story");
            }
        });

    };

    this.render = function() {
        var rendered = Mustache.render(window.cnews.newsArticleTemplate, this);
        var $rendered = $(rendered).hide();
        spinner(false);
        window.cnews.$main.html($rendered);

        $rendered.fadeIn();
    };

}

function StoryDraw() {

    this.$el = $("#story-draw");
    this.$stories = $(".stories-wrapper", this.$el);
    this.$toggle = $(".js-draw-bar", this.$el);
    var self = this;
    this.toggle = function() {

        this.$stories.slideToggle({easing: "easeOutBack"});

    }

    this.hide = function() {

        this.$stories.slideUp({easing: "easeOutBack"});

    }

    this.show = function() {

        this.$stories.slideDown({easing: "easeOutBack"});
 
    }

    this.$toggle.on("click", $.proxy(this.toggle, this));

    $(".stories-wrapper a").each(function(i, el) {
        $(el).on("click", function(e) { 
            self.hide();
        });
    });

}

function spinner(show) {

    if (show) {
        window.cnews.$main.fadeOut("fast");
    } else {
        window.cnews.$main.fadeIn("fast");
    }

}
