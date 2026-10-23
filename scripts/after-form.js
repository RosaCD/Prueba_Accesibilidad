/*
 * JavaScript for Accessible University Demo Site
 * http://uw.edu/accesscomputing/AU
 *
 * after-form.js = Handle form validation
 */

$(document).ready(function() {

  // add text-based captcha to the #captcha container
  // NOTE: This is just an example, not a real CAPTCHA 
  // See info.html for a discussion of captcha accessibility

  var captchas = getCaptchas(); 
  var captchaIndex = getCaptchaIndex(captchas.length);
  var question = captchas[captchaIndex]['question']; 
  var captchaFieldset = $('<fieldset>'); 
  var captchaLegend = $('<legend>').attr({
    class: 'required'
  }).text('Pregunta de seguridad ');
  var captchaStar = $('<span>').attr({
    'class': 'star',
    'aria-hidden': 'true'
  }).text('*');
  captchaLegend.append(captchaStar);
  var captchaLabel = $('<label>').attr({
    'id': 'captcha_label',
    'for': 'captcha_answer'
  }).text(question);
  var captchaInput = $('<input>').attr({
    'id': 'captcha_answer',
    'name': 'captcha_answer',
    'type': 'text',
    'required': ''
  });
  captchaFieldset.append(captchaLegend,captchaLabel,captchaInput);
  $('#captcha').append(captchaFieldset);

  // handle form submission 
  $('#submit').on('click',function(event) { 
    var skippedField, success, feedbackHeading, feedbackMsg, feedbackText; 
    event.preventDefault();
    skippedField = checkRequiredFields(); 
    if (skippedField) { 
      // display the error message, and place focus in the skipped field 
      $('#feedback').empty().text(skippedField['error']).show(); 
      $('#' + skippedField['fieldId']).focus(); 
      return false;
    }
    console.log('after checking for skipped fields');
    if ($('#captcha_answer').val().toLowerCase() === captchas[captchaIndex]['answer']) { 
      success = true; 
    }
    else { 
      success = false; 
    }
    if (success) { 
      $('title').text('¡Éxito! Universidad Accesible');
      feedbackHeading = $('<h3>').text('¡Gracias!');
      feedbackMsg = 'Hemos recibido tu solicitud.'
      feedbackText = $('<p>').text(feedbackMsg);
      $('#feedback').empty().append(feedbackHeading,feedbackText).show();
      // Reset the form 
      $('form input[type="text"]').val('');
      $('form input[type="email"]').val('');
      $('form input[type="checkbox"]').prop('checked',false);
    }
    else { 
      $('title').text('Error al enviar el formulario | Universidad Accesible');
      feedbackHeading = $('<h3>').text('Error');
      feedbackMsg = 'La respuesta a la pregunta de seguridad no es correcta. Inténtalo de nuevo.';
      feedbackText = $('<p>').text(feedbackMsg);
      $('#feedback').empty().append(feedbackHeading,feedbackText).show();
      // Empty the captcha field, but not the other fields
      // and place focus in the captcha field
      $('#captcha_answer').empty().focus(); 
    }
  });
});

function getCaptchas() {

  let captchas = [
    { 
      'question': 'Si una vaca es morada, ¿de qué color es?',
      'answer': 'morada'
    },
    { 
      'question': 'Domingo, vaca, viernes. ¿Cuál de estas opciones no es un día de la semana?',
      'answer': 'vaca'
    },
    { 
      'question': 'Vaca, pizza, auto. ¿Cuál de estas palabras tiene más de tres letras?',
      'answer': 'pizza'
    }
  ]
	return captchas;
}

function getCaptchaIndex(numCaptchas) { 

    // returns a random integer to use for randomly selected an item from the captchas array
  return Math.floor(Math.random() * numCaptchas);
}

function checkRequiredFields() { 

  // if a required field was skipped, returns an object with 'error' and 'fieldId'
  // else returns false 

  var required, skippedId, skippedLabel, result;

  result = null; 

  // get all required fields EXCEPT captcha (it's handled separately)
  required = $('input[required]').not('#captcha_answer'); 
  if (required.length > 0) { 
    // step through all required fields to be sure they have content 
    required.each(function() { 
      if ($(this).val() == '') { 
        // required field is empty. Get label for this field. 
        skippedId = $(this).attr('id'); 
        skippedLabel = $('label[for=' + skippedId + ']').text().replace(' *',''); 
        result = { 
          'error' : 'ERROR: El campo ' + skippedLabel + ' es obligatorio.',
          'fieldId' : skippedId
        }; 
        return false; // to break out of the each()  
      }
    });
    return result;   
  }
}
