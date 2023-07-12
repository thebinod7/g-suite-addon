function createAuthorizationCard() {
  var card = CardService.newCardBuilder();
  var authorizationUrl = "https://example.com/auth";
  var authorizationAction = CardService.newAuthorizationAction()
    .setAuthorizationUrl(authorizationUrl)
    .setOpenInNewWindow(true);

  var button = CardService.newTextButton()
    .setText("Authorize")
    .setAuthorizationAction(authorizationAction);

  var cardSection = CardService.newCardSection().addWidget(button);
  card.addSection(cardSection);

  return card.build();
}
