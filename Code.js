function onDefaultHomePageOpen() {
  console.log("Home!!!");
}

function createFormInputByType(input) {
  var title = input.title;
  var fieldName = input.id;
  switch (input.type) {
    case "text": {
      var textInput = CardService.newTextInput()
        .setFieldName(fieldName)
        .setTitle(title);
      return textInput;
    }
    case "dropdown": {
      var dropdown = CardService.newSelectionInput()
        .setType(CardService.SelectionInputType.DROPDOWN)
        .setTitle("A group of radio buttons.")
        .setFieldName(fieldName)
        .addItem("Option 1", "option_1", true)
        .addItem("Option 2", "option_2", false)
        .addItem("Option 3", "option_3", false);

      return dropdown;
    }

    default:
      return "";
  }
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

var MONDAY_AUTH_URL = "https://auth.monday.com/oauth2/authorize";
var MONDAY_CLIENT_ID = "7e0dd58133ae009a961817d40ed3384f";
var MONDAY_CLIENT_SECRET = "0aae00da873e1e8862484b468e379a75";
var MONDAT_ACCESS_TOKEN_URL = "https://auth.monday.com/oauth2/token";

var sample_data = [
  { id: "name", name: "name", title: "Item Name", type: "text", value: "" },
  {
    id: "email",
    name: "email",
    title: "Email Address",
    type: "text",
    value: "",
  },
  {
    id: "phone",
    name: "phone",
    title: "Phone Number",
    type: "text",
    value: "",
  },
  {
    id: "dropdown",
    name: "dropdown",
    title: "Dropdown",
    type: "dropdown",
    value: "",
  },
  {
    id: "dropdown1",
    name: "dropdown1",
    title: "Dropdown 1",
    type: "dropdown",
    value: "",
  },
];

function doGet(e) {
  var params = e.parameter;
  console.log("Params=>", params);
}

function fetchMondayAccessToken(code) {
  var data = {
    code: code,
    client_id: MONDAY_CLIENT_ID,
    client_secret: MONDAY_CLIENT_SECRET,
  };
  var queryString = Object.keys(data)
    .map(function (key) {
      return encodeURIComponent(key) + "=" + encodeURIComponent(data[key]);
    })
    .join("&");

  var fullURL = MONDAT_ACCESS_TOKEN_URL + "?" + queryString;
  var options = {
    method: "post",
    contentType: "application/x-www-form-urlencoded",
    muteHttpExceptions: true,
  };
  console.log("Opts=>", options);
  console.log("FullURL=>", fullURL);
  var response = UrlFetchApp.fetch(fullURL, options);
  console.log("RES==>", response);
  return response;
}

function authCallback(request) {
  var code = request.parameter.code;
  console.log("CODE=>", code);
  var token = fetchMondayAccessToken(code);
  return HtmlService.createHtmlOutput("Success! You can close this tab.");
  // var mondayService = getOAuthService();
  // var isAuthorized = mondayService.handleCallback(request);
  // console.log("Authorized=>", isAuthorized);
}

function getOAuthService() {
  return OAuth2.createService("monday")
    .setAuthorizationBaseUrl(MONDAY_AUTH_URL)
    .setTokenUrl(MONDAT_ACCESS_TOKEN_URL)
    .setClientId(MONDAY_CLIENT_ID)
    .setClientSecret(MONDAY_CLIENT_SECRET)
    .setCallbackFunction("authCallback")
    .setCache(CacheService.getUserCache())
    .setPropertyStore(PropertiesService.getUserProperties());
}

function onGmailMessageOpen(e) {
  var card = CardService.newCardBuilder();
  var section = CardService.newCardSection();

  var formAction = CardService.newAction().setFunctionName("handleFormSubmit");

  var submitButton = CardService.newTextButton()
    .setText("Submit")
    .setOnClickAction(formAction);

  var buttonOAuth = CardService.newTextButton()
    .setText("Connect to Monday")
    .setOnClickAction(
      CardService.newAction().setFunctionName("handleButtonClick")
    );

  var widgets;

  for (var i = 0; i < sample_data.length; i++) {
    var _input = createFormInputByType(sample_data[i]);
    widgets = section.addWidget(_input);
  }
  widgets.addWidget(submitButton).addWidget(buttonOAuth);
  card.addSection(widgets);
  return card.build();
}

function handleButtonClick(e) {
  return createAuthorizationCard();
}

function createAuthorizationCard() {
  var service = getOAuthService();
  var authorizationUrl = service.getAuthorizationUrl();
  var redirect_uri = service.getRedirectUri();
  console.log("Redirect=>>", redirect_uri);

  var card = CardService.newCardBuilder();
  var authorizationAction =
    CardService.newAuthorizationAction().setAuthorizationUrl(authorizationUrl);
  var button = CardService.newTextButton()
    .setText("Authorize to Monday")
    .setAuthorizationAction(authorizationAction);
  var cardSection = CardService.newCardSection().addWidget(button);
  card.addSection(cardSection);
  return card.build();
}

function handleFormSubmit(e) {
  // console.log("FORM=>", e.formInput);

  var message = CardService.newTextParagraph().setText(
    "Form submitted successfully!"
  );

  var updatedCard = CardService.newCardBuilder()
    .addSection(CardService.newCardSection().addWidget(message))
    .build();

  return updatedCard;
}
