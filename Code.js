function onDefaultHomePageOpen(){
  console.log("Home!!!")
}

function createFormInputByType(input){
  var title = input.title;
  var fieldName = input.id;
  switch(input.type){
    case 'text': {
       var textInput = CardService.newTextInput()
        .setFieldName(fieldName)
        .setTitle(title)
        return textInput;
    }
    case 'dropdown': {
           var dropdown = CardService.newSelectionInput()
            .setType(CardService.SelectionInputType.DROPDOWN)
            .setTitle("A group of radio buttons.")
            .setFieldName(fieldName)
            .addItem("Option 1", "option_1", true)
            .addItem("Option 2", "option_2", false)
            .addItem("Option 3", "option_3", false);

            return dropdown;
    }

    default: return ''
  }
}

// Create Card Section
// Loop through sample data
// Get input by type
// Add as widget in chain
function renderSettingsForm(){
  // Fetch account ID
  // Fetch settings by account ID
  // Display fields based on settings
  // Populate field values
  // Submit field values to Monday board
}
var sample_data = [
  {id:'name', name:"name", title:"Item Name", type:'text', value:''},
  {id:'email', name:"email", title:'Email Address', type:'text', value:''},
  {id:'phone', name:"phone", title:'Phone Number', type:'text', value:''},
  {id:'dropdown', name:"dropdown", title:'Dropdown', type:'dropdown', value:''},
  {id:'dropdown1', name:"dropdown1", title:'Dropdown 1', type:'dropdown', value:''},
]

  function onGmailMessageOpen(e) {
      var card = CardService.newCardBuilder();
      var section = CardService.newCardSection();
  
      var formAction = CardService.newAction()
        .setFunctionName('handleFormSubmit');
    
      // var emailField = CardService.newTextInput()
      //   .setFieldName('email')
      //   .setTitle('Email')
    
      var submitButton = CardService.newTextButton()
        .setText('Submit')
        .setOnClickAction(formAction);

      var widgets;

      for(var i=0; i< sample_data.length; i++) {
        var _input = createFormInputByType(sample_data[i]);
        widgets = section.addWidget(_input);
      }
      widgets.addWidget(submitButton);
    console.log("W==>",widgets)
      // var widgets = section
      //   .addWidget(inputField)
      //   .addWidget(emailField)
      //   .addWidget(submitButton);
    
      card.addSection(widgets);
  return card.build();
}

function handleFormSubmit(e) {
  console.log("FORM=>", e.formInput);
  var name = e.formInput['name'];
  var email = e.formInput['email'];
  var phone = e.formInput['phone'];
  var dropdown = e.formInput['dropdown'];
  var dropdown1 = e.formInput['dropdown1'];


  console.log('Phone', phone);
  console.log(dropdown,dropdown1);
  
  var message = CardService.newTextParagraph()
    .setText('Form submitted successfully!');
    
  var updatedCard = CardService.newCardBuilder()
    .addSection(CardService.newCardSection().addWidget(message))
    .build();
    
  return updatedCard;
}
