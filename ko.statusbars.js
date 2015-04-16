ko.bindingHandlers.statusbars = {
  init: function(element, valueAccessor) {
    var vm = ko.unwrap(valueAccessor());

    element.style.position = 'fixed';
    element.style.bottom = 0;
    element.style.left = 0;
    element.style.zIndex = 2147483647;

    element.innerHTML = document.getElementById('ko-statusbars-template').innerHTML;

    ko.applyBindingsToDescendants(vm, element);
    return {controlsDescendantBindings: true};
  }
};

(function() {
  var template = document.createElement('script');
  template.id = 'ko-statusbars-template';
  template.type = 'text/html';
  template.innerHTML =
    '<ul class="list-group" data-bind="foreach: statusbars">' +
      '<li class="list-group-item" data-bind="visible: message, css: css">' +
        '<!-- ko text: message --><!-- /ko -->' +
        '<button class="close" data-bind="click: close" style="margin-left: 1em;">&times;</button>' +
      '</li>' +
    '</ul>';
  document.body.appendChild(template);

  ko.bindingHandlers.statusbars.viewModel = function() {
    var self = this;

    self.statusbars = ko.observableArray();

    self.css_mappings = {
      'error': 'list-group-item-danger',
      'info': 'list-group-item-info'
    };

    self.new_statusbar = function(msg, type) {
      var statusbar = {
        message: ko.observable(msg),
        css: ko.observable(self.css_mappings[type])
      };

      statusbar.info = function(msg, append) {
        if (self.statusbars.indexOf(statusbar) == -1)
          self.statusbars.push(statusbar);
        statusbar.message(append ? statusbar.message() + ' ' + msg : msg);
        statusbar.css(self.css_mappings.info);
      };
      statusbar.error = function(msg, append) {
        if (self.statusbars.indexOf(statusbar) == -1)
          self.statusbars.push(statusbar);
        statusbar.message(append ? statusbar.message() + ' ' + msg : msg);
        statusbar.css(self.css_mappings.error);
      };
      statusbar.close = function() {
        self.statusbars.remove(statusbar);
      };

      self.statusbars.push(statusbar);
      return statusbar;
    };
    self.error = function(msg) {
      return self.new_statusbar(msg, 'error');
    };
    self.info = function(msg) {
      return self.new_statusbar(msg, 'info');
    };
    self.create = self.info;
  };
})();
