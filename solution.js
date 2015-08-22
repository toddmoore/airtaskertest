(function() {
  var solution,
  stampit = require('stampit'),

  // Object References
  templateMethods,
  activityListProps,
  activityListTemplateMethods,
  defaultProps,
  dataMethods;

  /**
   * Defaults object;
   * @type {Object}
   */
  defaultProps = {
    styleSheetUrl: "https://www.airtasker.com/stylesheets/style.css"
  }

  /**
   * Generic templateMethods
   * @type {Object}
   */
  templateMethods = {
    getStylsheet: function() {
      return "<link href=\""+this.styleSheetUrl+"\" rel=\"stylesheet\">";
    },
    getHeader: function(){
      return "<html><head>"+this.getStylsheet()+"</head><body>"
    },
    getFooter: function(){
      return "</body></html>";
    }
  };

  /**
   * activity List Properties
   * @type {Object}
   */
  activityListProps = {
    activityFeedClasses: ['list', "activity-feed"],
    userNameClasses: ['user-name'],
    listItemClases: ['activity-feed-item'],
    templateRegX: /(\{ {1}[a-z]*\:\d* {1}\})/
  }

  /**
   * Used for generating templateStrings for the activity list
   * @type {Object}
   */
  activityListTemplateMethods = {
    generateListPrefix: function(){
      return "<ul class=\""+this.activityFeedClasses.join(' ').trim()+"\">";
    },
    generateListSuffix: function(){
      return "</ul>";
    },
    generateListItemPrefix: function(){
      return "<li class=\""+this.listItemClases.join(' ').trim()+"\">"
    },
    generateListItemSuffix: function(){
      return "</li>";
    },
    generateLink: function(key, data){
      switch(key){
        case "profiles":
          return "<a class='"+this.userNameClasses.join(' ').trim()+"' href='/users/"+data.slug+"' style='background-image:url("+data.avatar.tiny.url+"); padding-left:18px;'>"+data.abbreviated_name+"</a>";
        case "task":
          return "<a href='/tasks/"+data.slug+"'>"+data.name+"</a>";
      }
    },
    render: function(arrayOfActivity){
      return this.getHeader()
              +this.generateListPrefix()
              +arrayOfActivity.reduceRight(function(prev, next){return prev + next;})
              +this.generateListSuffix()
              +this.getFooter();
    },
    /**
     * Process a string of type '{ key:value } <text> { key:value } ...'
     * @param  {Oject}  data      Data to be filtered
     * @param  {String} template  template property on activity_feed item
     * @return {String}           List Item
     */
    processTemplate: function(data, template){
      var item=this.generateListItemPrefix(), anchor;
      template.split(this.templateRegX).forEach(function(token){
            if(token.search(this.templateRegX) != -1){
              anchor = this.getKeyAndValueFromString(token);
              anchor = this.generateLink(anchor[0], this.getItem(data, {key: anchor[0], id:anchor[1] }));
              item = item+anchor;
            }else{
              item = item+token;
            }
      }.bind(this));
      item = item + this.generateListItemSuffix();
      return item;
    }
  };

  /**
   * Used for filtering and retrieving data
   * @type {Object}
   */
  dataMethods = {
    /**
     * Returns array from '{key:value}'
     * @param  {String} string {key:value}
     * @return {Array}
     */
    getKeyAndValueFromString: function(string){
        return string.substring(string.indexOf("{")+2, string.indexOf("}")).split(":");
    },
    /**
     * Returns item from datastore
     * @param  {Object} data Datastore reference
     * @param  {Object} ref  {id:Number, key:String}
     * @return {Object}
     */
    getItem: function(data, ref){
      ref.key[ref.key.length-1] == 's' ? ref.key : ref.key=ref.key+'s'; // all keys are plural
      return data[ref.key].filter(function(item){
        return parseInt(item.id) == parseInt(ref.id);
      })[0]
    }
  };

  solution = {
    generateActivityList: function(data) {
      // factory to create activity object
      const activity = stampit()
                      .methods(templateMethods, dataMethods, activityListTemplateMethods)
                      .refs(defaultProps, activityListProps).call(this);

      return activity.render(data.activity_feed.map(function(item){
          return activity.processTemplate(data, item.template);
      }).reverse());

    }
  };
  module.exports = solution;

}).call(this);
