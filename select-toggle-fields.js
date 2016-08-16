H5PEditor.SelectToggleFields = (function ($) {

  function SelectToggleFields(parent, field, params, setValue) {
    var self = this;

    self.field = field;
    // Outsource readies
    self.passReadies = true;

    var fieldsToHide = [];
    var nameToFieldMap = {};

    parent.ready(function () {
      for (var i = 0; i < field.options.length; i++) {
        var option = field.options[i];
        if (option.hideFields) {
          option.hideFields.forEach(function (path) {
            var f = H5PEditor.findField(path, parent);
            if (f.getDomElement !== undefined) {
              var $element = f.getDomElement();
              fieldsToHide.push($element);
              if (nameToFieldMap[option.value] === undefined) {
                nameToFieldMap[option.value] = [];
              }
              nameToFieldMap[option.value].push($element);
            }
            else {
              //throw
              console.error('Wrong usage - field need to implement getDomElement()');
            }
          });
        }
      }

      $selectWrapper.find('select').val(params);
      setValue(self.field, params);
      updateUI(params);
    });

    var $selectWrapper = $('<div>', {});

    var semantics = [
      {
        name: field.name,
        type: field.type,
        label: field.label,
        options: field.options,
        optional: field.optional
      }
    ];

    H5PEditor.processSemanticsChunk(semantics, params, $selectWrapper, self);

    var updateUI = function (value) {
      var fields = nameToFieldMap[value];

      if (fields) {
        // Unhide all fields:
        for (var i = 0; i < fieldsToHide.length; i++) {
          fieldsToHide[i].removeClass('h5peditor-select-toggle-field-hide');
        }

        if (fields) {
          fields.forEach(function (f) {
            f.addClass('h5peditor-select-toggle-field-hide');
          });
        }
      }
      else {
        // Hide all fields:
        for (var i = 0; i < fieldsToHide.length; i++) {
          fieldsToHide[i].addClass('h5peditor-select-toggle-field-hide');
        }
      }
    };

    $selectWrapper.find('select').on('change', function () {
      var value = $(this).val();
      setValue(self.field, value);
      updateUI(value);
    });

    /**
     *
     */
    self.appendTo = function ($wrapper) {
      $wrapper.append($selectWrapper);
    };

    /**
     * Always validate
     * @return {boolean}
     */
    self.validate = function () {
      return true;
    };

    self.remove = function () {};
  }

  return SelectToggleFields;
})(H5PEditor.$);

// Register widget
H5PEditor.widgets.selectToggleFields = H5PEditor.SelectToggleFields;
