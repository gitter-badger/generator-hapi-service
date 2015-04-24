'use strict';

var _ = require('lodash');
var yeoman = require('yeoman-generator');
var slug = require('slug');

module.exports = yeoman.generators.Base.extend({

  initializing: function () {
    this.argument('name', {
      required: true,
      type: String,
      desc: 'Controller generator'
    });
  },

  createControllerFile: function() {
    this.nameSlug = this.name;
    this.nameSlugCC = _.camelCase(this.name);
    this.nameSlugKC = _.kebabCase(this.name);
    this.template(this.templatePath('controller.js'), this.destinationPath('./controllers/' + this.nameSlugCC + 'Controller.js'));
  }
});
