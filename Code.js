function onDefaultHomePageOpen(){
  console.log("Home!!!")
}

function createFormInputByType(input){
  switch(input.type){
    case 'text': {
       var textInput = CardService.newTextInput()
        .setFieldName("myTextBox")
        .setTitle("Enter your text")
        .setHint("Type here");

        return textInput;
    }
    case 'dropdown': {
           var dropdown = CardService.newSelectionInput()
            .setType(CardService.SelectionInputType.DROPDOWN)
            .setTitle("A group of radio buttons.")
            .setFieldName("checkbox_field")
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
  {id:'name', title:"Item Name", type:'text', value:''},
  {id:'dropdown', title:'Dropdown', type:'dropdown', value:''},
  {id:'email', title:'Email Address', type:'text', value:''},
]
  function createCard(title){
    return CardService.newCardBuilder()
        .setHeader(CardService.newCardHeader()
            .setTitle(title))
  }

  function onGmailMessageOpen(e) {
     var card = CardService.newCardBuilder();
  
     var formAction = CardService.newAction()
        .setFunctionName('handleFormSubmit');
    
      var inputField = CardService.newTextInput()
        .setFieldName('name')
        .setTitle('Name')

      var emailField = CardService.newTextInput()
        .setFieldName('email')
        .setTitle('Email')
    
      var submitButton = CardService.newTextButton()
        .setText('Submit')
        .setOnClickAction(formAction);
    
      var section = CardService.newCardSection()
        .addWidget(inputField)
        .addWidget(emailField)
        .addWidget(submitButton);
    
      card.addSection(section);
  return card.build();

    // var html = HtmlService.createTemplateFromFile("sidebar").evaluate().getContent();
    // return CardService.newCardBuilder()
    // .setHeader(CardService.newCardHeader().setTitle('Contact Details'))
    // .addSection(CardService.newCardSection().addWidget(CardService.newKeyValue().setContent(html)))
    // .build();
}

function handleFormSubmit(e) {
  var name = e.formInput['name'];
  var email = e.formInput['email'];

  console.log(name,email);
  
  var message = CardService.newTextParagraph()
    .setText('Form submitted successfully!');
    
  var updatedCard = CardService.newCardBuilder()
    .addSection(CardService.newCardSection().addWidget(message))
    .build();
    
  return updatedCard;
}
