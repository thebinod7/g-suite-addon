function onDefaultHomePageOpen() {
  console.log("Home!!!");
}

function createFormInputByType(input) {
  switch (input.type) {
    case "text": {
      var textInput = CardService.newTextInput()
        .setFieldName("myTextBox")
        .setTitle("Enter your text")
        .setHint("Type here");

      return textInput;
    }
    case "dropdown": {
      var dropdown = CardService.newSelectionInput()
        .setType(CardService.SelectionInputType.DROPDOWN)
        .setTitle("A group of radio buttons.")
        .setFieldName("checkbox_field")
        .addItem("Option 1", "option_1", true)
        .addItem("Option 2", "option_2", false)
        .addItem("Option 3", "option_3", false);

      return dropdown;
    }

    default:
      return "";
  }
}

function createCardWithTitle(title) {
  return CardService.newCardBuilder().setHeader(
    CardService.newCardHeader().setTitle(title)
  );
}

// Create Card Section
// Loop through sample data
// Get input by type
// Add as widget in chain
function renderSettingsForm() {
  // Fetch account ID
  // Fetch settings by account ID
  // Display fields based on settings
  // Populate field values
  // Submit field values to Monday board
}
var sample_data = [
  { id: "name", title: "Item Name", type: "text", value: "" },
  { id: "dropdown", title: "Dropdown", type: "dropdown", value: "" },
  { id: "email", title: "Email Address", type: "text", value: "" },
];

function onGmailMessageOpen(e) {
  renderSettingsForm();
  // Activate temporary Gmail scopes, in this case to allow
  // message metadata to be read.
  var accessToken = e.gmail.accessToken;
  GmailApp.setCurrentMessageAccessToken(accessToken);

  var messageId = e.gmail.messageId;
  var message = GmailApp.getMessageById(messageId);
  var subject = message.getSubject();
  var sender = message.getFrom();

  var textInput = CardService.newTextInput()
    .setFieldName("myTextBox")
    .setTitle("Enter your text");

  var dropdown = CardService.newSelectionInput()
    .setType(CardService.SelectionInputType.DROPDOWN)
    .setTitle("-Select Options-")
    .setFieldName("dropdown_field")
    .addItem("Option 1", "option_1", true)
    .addItem("Option 2", "option_2", false)
    .addItem("Option 3", "option_3", false);

  var _card = createCardWithTitle("Contact Details");

  var displayCard = _card
    .addSection(
      CardService.newCardSection()
        .addWidget(
          CardService.newKeyValue().setTopLabel("Subject").setContent(subject)
        )
        .addWidget(
          CardService.newKeyValue().setTopLabel("From").setContent(sender)
        )
    )
    .build();

  var dynamicCard;

  if (sample_data.length) {
    dynamicCard = createCardWithTitle();
    for (var i = 0; i < sample_data; i++) {
      console.log(sample_data[i]);
      var _input = createFormInputByType(sample_data[i]);
      dynamicCard
        .addSection(CardService.newCardSection().addWidget(_input))
        .build();
    }

    return [displayCard, dynamicCard];
  } else {
    var displayCard = _card
      .addSection(CardService.newCardSection())
      .addWidget(
        CardService.newKeyValue().setTopLabel("Subject").setContent(subject)
      )
      .addWidget(
        CardService.newKeyValue().setTopLabel("From").setContent(sender)
      )
      .build();
    return [displayCard];
  }
}
