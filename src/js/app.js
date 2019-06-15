App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
    // TODO: refactor conditional
    if (typeof web3 !== 'undefined') {
      // If a web3 instance is already provided by Meta Mask.
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
    }
    return App.initContract();
  },

  initContract: function() {
    $.getJSON("Shop.json", function(shop) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.Shop = TruffleContract(shop);
      // Connect provider to interact with contract
      App.contracts.Shop.setProvider(App.web3Provider);

      //App.listenForEvents();

      return App.render();
    });
  },

  // Listen for events emitted from the contract
  listenForEvents: function() {
    // App.contracts.Shop.deployed().then(function(instance) {

    //   instance.votedEvent({}, {
    //     fromBlock: 0,
    //     toBlock: 'latest'
    //   }).watch(function(error, event) {
    //     console.log("event triggered", event)
    //     // Reload when a new vote is recorded
    //     App.render();
    //   });
    // });
  },

  render: function() {
    var shopInstance;
    var loader = $("#loader");
    var content = $("#content");

    loader.show();
    content.hide();

    // Load account data
    web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        App.account = account;
        $("#accountAddress").html("Your Account: " + account);
      }
    });

    // Load contract data
    App.contracts.Shop.deployed().then(function(instance) {
      shopInstance = instance;
      return shopInstance.idCounter();
    }).then(function(idCounter) {
      var productsResults = $("#productsResults");
      productsResults.empty();

      var productSelect = $('#productSelect');
      productSelect.empty();

      for (var i = 0; i < idCounter; i++) {
        shopInstance.products(i).then(function(product) {
          var id = product[0];
          var name = product[1];
          var owner = product[2];
          var price = product[3];
          var quantity = product[4];
          

          // Render product Result
          var productTemplate = "<tr><th>" + id + "</th><td>" + name + "</td><td>" + owner + "</td><td>" + price + "</td><td>" + quantity + "</td></tr>"
          productsResults.append(productTemplate);

          // Render product ballot option
          var productOption = "<option value='" + id + "' >" + name + "</ option>"
          productSelect.append(productOption);
        });
      }
      //return shopInstance.voters(App.account);
      loader.hide();
      content.show();
    }).catch(function(error) {
      console.warn(error);
    });
  },

  buyProduct: function() {
    var productId = $('#productSelect').val();

    const amountToSend = web3.toWei(1, "ether"); 
    //console.log(contractAddress);


    var shopinstance;

    App.contracts.Shop.deployed().then(function(instance) {
      shopinstance = instance;
      return instance.buyProduct(productId, { from: App.account, gas: 6721975, value: amountToSend });
    }).then(function(result) {
      console.log(JSON.stringify(result));
      // Wait for votes to update
      //console.log(shopinstance.products(productId));
      result.receipt.productName = candidateInfo[0];
      result.receipt.productPrice = candidateInfo[1];
      const d = new Date();
      result.receipt.transactionTime = `${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()}, ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()} UTC+${d.getTimezoneOffset()/(-60)}`; 
      sendLog(result.receipt);
      $("#content").hide();
      $("#loader").show();
      return App.render();
    }).catch(function(err) {
      console.error(err);
    });
  }
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
