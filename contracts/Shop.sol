pragma solidity ^0.5.0;


contract Shop {
    struct Product {
        uint256 id;
        string name;
        address payable owner;
        uint256 price;
        uint256 quantity;
    }

    address payable public owner = 0x97496425BE79D8fabC7A103322F31774E482f620;

    mapping(uint256 => Product) public products;
    uint256 public idCounter = 0;

    constructor() Shop() public {
        addProduct("applejuice", 0.44 ether, owner, 10);
        addProduct("apple", 0.05 ether, owner, 100);
        addProduct("tomato", 0.1 ether, owner, 250);
    }

    function addProduct(string memory _name, uint256 _price, address payable _owner, uint256 _quantity) public {
        products[idCounter] = Product(idCounter, _name, _owner, _price, _quantity);
        idCounter++;
    }

    function buyProduct(uint256 _productId) public payable{
        Product memory product = products[_productId];

        require(msg.value >= product.price, "not enough funds");
        uint256 quantityToBuy = msg.value / product.price;

        if (quantityToBuy <= product.quantity) {
            uint256 change = msg.value % product.price;
            uint256 valueToSend = msg.value - change;
            require(valueToSend == product.price * quantityToBuy, "value doesn't match");

            products[_productId].quantity = product.quantity - quantityToBuy;
            product.owner.transfer(valueToSend);
            msg.sender.transfer(change);
        }
        //return quantityToBuy;


        // require(
        //     (_candidateId > 0 && _candidateId <= candidatesCount),
        //     "there is no candidate with such ID"
        // );
        // voters[msg.sender] = true;

        // candidates[_candidateId].voteCount++;
    }
}