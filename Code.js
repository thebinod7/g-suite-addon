function onDefaultHomePageOpen() {
  console.log("Home!!!");
  return homepageCard();
}

function homepageCard() {
  var msg = CardService.newTextParagraph().setText(
    "Open inbox item before gmail addon."
  );
  var updatedCard = CardService.newCardBuilder()
    .addSection(CardService.newCardSection().addWidget(msg))
    .build();
  return updatedCard;
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
var MONDAY_CLIENT_ID = "";
var MONDAY_CLIENT_SECRET = "";
var MONDAT_ACCESS_TOKEN_URL = "https://auth.monday.com/oauth2/token";
var MONDAY_API_ENDPOINT = "https://api.monday.com/v2";
var OFFSITE_API_ENDPOINT = "https://app.addoffsite.com";
var OFFSITE_API_SECRET = "";

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

function getToken() {
  var properties = PropertiesService.getUserProperties();
  var token = properties.getProperty("access_token");
  return token;
}

function doGet(e) {
  var params = e.parameter;
  console.log("Params=>", params);
}

function saveToken(token) {
  var properties = PropertiesService.getUserProperties();
  properties.setProperty("access_token", token);
}

function fetchMondayAccessToken(code) {
  var service = getOAuthService();
  var redirect_uri = service.getRedirectUri();
  var data = {
    code: code,
    client_id: MONDAY_CLIENT_ID,
    client_secret: MONDAY_CLIENT_SECRET,
    redirect_uri: redirect_uri,
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
  var response = UrlFetchApp.fetch(fullURL, options);
  if (!response) return null;
  var json = JSON.parse(response);
  return json.access_token;
}

function authCallback(request) {
  var code = request.parameter.code;
  var access_token = fetchMondayAccessToken(code);
  console.log("Access=>", access_token);
  if (!access_token)
    return HtmlService.createHtmlOutput("Fail! Internal server error!.");
  saveToken(access_token);
  return HtmlService.createHtmlOutput("Success! You can close this tab.");
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

function handleLogoutClick() {
  var service = getOAuthService();
  service.reset();
  saveToken("");
  return logoutResponseCard();
}

function saveContactCard() {
  var msg = CardService.newTextParagraph().setText("Save contact!");
  var updatedCard = CardService.newCardBuilder()
    .addSection(CardService.newCardSection().addWidget(msg))
    .build();
  return updatedCard;
}

function updateContactCard() {
  var msg = CardService.newTextParagraph().setText("Update contact!");
  var updatedCard = CardService.newCardBuilder()
    .addSection(CardService.newCardSection().addWidget(msg))
    .build();
  return updatedCard;
}

function authenticationCard() {
  var btnInstall = CardService.newTextButton()
    .setText("Install Monday")
    .setOpenLink(
      CardService.newOpenLink()
        .setUrl(
          "https://auth.monday.com/oauth2/authorize?client_id=7e0dd58133ae009a961817d40ed3384f&response_type=install"
        )
        .setOpenAs(CardService.OpenAs.FULL_SIZE)
    )
    .setTextButtonStyle(CardService.TextButtonStyle.TEXT);

  var btnAuth = CardService.newTextButton()
    .setText("Login to Monday")
    .setOnClickAction(
      CardService.newAction().setFunctionName("handleLoginClick")
    );

  var msg = CardService.newTextParagraph().setText(
    "Install Monday app if you are a first time user."
  );

  var updatedCard = CardService.newCardBuilder()
    .addSection(
      CardService.newCardSection()
        .addWidget(msg)
        .addWidget(btnInstall)
        .addWidget(btnAuth)
    )
    .build();
  return updatedCard;
}

function fetchGmailSettings(accountId) {
  var headers = {
    apisecret: OFFSITE_API_SECRET,
    "Content-Type": "application/json",
  };
  var options = {
    method: "get",
    contentType: "application/json",
    muteHttpExceptions: true,
    headers: headers,
  };
  var backendUrl =
    OFFSITE_API_ENDPOINT +
    "/api/v1/crm-settings/" +
    accountId +
    "/account/Gmail Contact";
  console.log("Backend=>", backendUrl);
  var res = UrlFetchApp.fetch(backendUrl, options);
  return JSON.parse(res);
}

function fetchMondayAccountDetails(accessToken) {
  var query = "query { me {name id  account{id name slug}}}";
  var headers = {
    Authorization: accessToken,
    "Content-Type": "application/json",
  };
  var options = {
    method: "post",
    contentType: "application/json",
    muteHttpExceptions: true,
    headers: headers,
    payload: JSON.stringify({ query: query }),
  };
  var res = UrlFetchApp.fetch(MONDAY_API_ENDPOINT, options);
  return JSON.parse(res);
}

function showBlankSettingsCard() {
  var msg = CardService.newTextParagraph().setText(
    "No settings found, Please save your settings first!"
  );
  var updatedCard = CardService.newCardBuilder()
    .addSection(CardService.newCardSection().addWidget(msg))
    .build();

  return updatedCard;
}

function onGmailMessageOpen(e) {
  var currentCard = "save";
  var accessToken = getToken();

  if (!accessToken) return authenticationCard();

  var account = fetchMondayAccountDetails(accessToken);
  var accountId = account.account_id.toString();
  var settings = fetchGmailSettings(accountId);
  if (!settings || !settings.data) return showBlankSettingsCard();
  console.log("Settings=>", settings.data);

  if (currentCard === "save") return saveContactCard("save");
  if (currentCard === "update") return updateContactCard("update");

  var card = CardService.newCardBuilder();
  var section = CardService.newCardSection();

  var formAction = CardService.newAction().setFunctionName("handleFormSubmit");

  var submitButton = CardService.newTextButton()
    .setText("Submit")
    .setOnClickAction(formAction);

  var btnLogout = CardService.newTextButton()
    .setText("Logout")
    .setOnClickAction(
      CardService.newAction().setFunctionName("handleLogoutClick")
    );

  var btnAuth = CardService.newTextButton()
    .setText("Connect to Monday")
    .setOnClickAction(
      CardService.newAction().setFunctionName("handleLoginClick")
    );

  var widgets;

  for (var i = 0; i < sample_data.length; i++) {
    var _input = createFormInputByType(sample_data[i]);
    widgets = section.addWidget(_input);
  }
  if (accessToken) widgets.addWidget(submitButton).addWidget(btnLogout);
  else widgets.addWidget(submitButton).addWidget(btnAuth);
  card.addSection(widgets);
  return card.build();
}

function handleLoginClick(e) {
  return createAuthorizationCard();
}

function createAuthorizationCard() {
  var service = getOAuthService();
  var authorizationUrl = service.getAuthorizationUrl();
  var redirect_uri = service.getRedirectUri();

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

function logoutResponseCard() {
  var msg = CardService.newTextParagraph().setText("Logged out successfully!");

  var updatedCard = CardService.newCardBuilder()
    .addSection(CardService.newCardSection().addWidget(msg))
    .build();

  return updatedCard;
}
