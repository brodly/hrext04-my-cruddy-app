/*
Update Storage Prototype to accept Objects
*/
Storage.prototype.setObject = function(key, value) {
  this.setItem(key, JSON.stringify(value));
}

Storage.prototype.getObject = function(key) {
  return JSON.parse(this.getItem(key));
}


/* 
Defaults
*/
var categoryList = ['Books', 'Recipes', 'Movies', 'Restaurants'];
localStorage.setObject('categoryList', categoryList);

/* 
Item Class Prototype
*/
var Item = function(name, category, description, note) {
  this.name = name;
  this.category = category;
  this.description = description;
  this.note = note;
};


/*
Functions
*/

/*
Searches Local Storage for matching Item Object and returns if found
*/
var searchLocalStorage = function(term) {
  console.log(typeof term);
  for (var i of Object.keys(localStorage)) {
    if (i.replace(/\s+/g, '').toLowerCase() === term.replace(/\s+/g, '').toLowerCase()) {
      return i;
    } else {
      return false;
    }
  }
};

/* 
Formats String to Titlecase
-Beginning of each word is uppercase and the rest of the word is lowercase
i.e Website, Toy Story, This Is My House
*/
var formatString = function(string) {
  return string.replace(/(^|\s)[a-z]/g, function(f) {
    return f.toUpperCase();
  })
};

/*
Updates categoryList with string when user adds a new category
*/
var pushToCategoryArray = function(category) {
  if (!categoryList.includes(category)) {
    categoryList.push(category);
    localStorage.setObject("categoryList", categoryList);
    return true;
  } else {
    alert(category + ' already exists!')
    return false;
  }
};

/*
Removes category string from categoryList
*/
var popFromCategoryArray = function(category) {
  if (categoryList.includes(category)) {
    var index = categoryList.indexOf(category);
    if (index > -1) {
      categoryList.splice(index, 1);
      localStorage.setObject('categoryList', categoryList);
      alert(category + " category removed")
    }
  }
};

/*
Category List Functions
*/
var populateCategoryList = function() {
  for (var e of categoryList) {
    $(".category-container").append(`<div class="category-item">${e}</div>`)
  }
};

var addToCategoryList = function (category) {
  $(".category-container").append(`<div class="category-item">${category}</div>`);
};

var removeFromCategoryList = function(category) {
  if (categoryList.includes(category)) {
    $(`.category-item:contains(${category})`).remove();
  } else {
    alert(category + ' does not exist!')
  }
};

/*
Category Dropdown Functions
*/
var populateCategoryDropdown = function(){
  for (var e of categoryList) {
    $("select").append(`<option>${e}</option>`);
  }
};

var addToCategoryDropdown = function(category) {
  $("select").append(`<option selected>${category}</option>`);
};

var removeFromCategoryDropdown = function(category) {
  if (categoryList.includes(category)) {
    $(`option:contains(${category})`).remove();
  } else {
    alert(category + ' does not exist!')
  }
};

/*
New Category Prompt
*/
var addNewCategory = function(category) {
  if (category !== null) {
    if (category !== '') {
      category = formatString(category);
      if (pushToCategoryArray(category)) {
        addToCategoryDropdown(category);
        addToCategoryList(category);
      }
    } else {
      console.log('Category is EMPTY/NULL')
    }
  }
};

var resetDropboxDisplay = function() {
  $("select").prop('selectedIndex', '#select-category');
};


/* 
jQuery Begins
*/
$(document).ready(function() {
  resetDropboxDisplay();
  populateCategoryList();
  populateCategoryDropdown();
  /*
  Selector variables
  */
  var $inputSearchBar = $("input.search-bar");
  var $addTextBtn = $(".add-text-btn");
  var $userInputTitle = $(".user-input-title");
  var $userInputDesc = $(".user-input-desc");
  var $displayItem = $(".display-item");
  var $addCategoryItem = $(".add-category-item");
  var $categoryRow = $(".category-row");
  var $categoryContainer = $(".category-container");
  var $itemList = $(".item-list");
  var $categoryDisplay = $(".category-details");

  /* 
  Search bar functionality
  Both on individual keypress (realtime search) and on enter
  */
  $inputSearchBar.on('keyup', function(event) {
    var $searchVal = $inputSearchBar.val();
    if (searchLocalStorage($searchVal) !== false) {
      console.log(localStorage.getObject(searchLocalStorage($searchVal)));
    }
  });

  $inputSearchBar.on('keypress', function(event) {
    var key = event.which;
    var $searchVal = $inputSearchBar.val();
    if (key === 13) {
      console.log(localStorage.getObject(searchLocalStorage($searchVal)));
    }
  });


  /*
  Add Item Button
  Adds Item in localStorage as an object.
  */
  $addTextBtn.on("click", function(){
    // store values
    let inputKey = formatString($userInputTitle.val());
    let inputDesc = formatString($userInputDesc.val());
    let inputCategory = $("select").val();

    if (inputCategory === null) {
      inputCategory = 'unsorted';
    }

    // Clear Item Entry Forms
    $userInputTitle.val("");
    $userInputDesc.val("");

    console.log('Item Stored in localStorage: ', inputKey, inputDesc, inputCategory);
    
    var item = new Item(inputKey, inputCategory, inputDesc);
    localStorage.setObject(inputKey, item);


    // Confirmation of Item Added to List
    let itemHtml = `<div class="display-item" data-storage-key="${inputKey}">Added to Local Storage: ${inputKey}</div>`;
    $(".display").html(itemHtml);
    $(".display").fadeTo("4000", ".75");
    setTimeout(function(){
      return $(".display").fadeTo("5000", "0");
    }, 5000);
  
    
    // how can we delegate this event to the outer html node?
    // https://learn.jquery.com/events/event-delegation/



    /*
    Do we still want this functionality? Possible hover over/click brings up options
    including delete, but also edit.

    NOTE: Item display now moved into particular category
    */
    $displayItem.on("click", function(e){
      // plop the key:value back into the input boxes

      // get the values from the the divs?
      console.log("key=> ", e.target.dataset.storageKey); // user-input-title
      var test = localStorage.getItem(e.target.dataset.storageKey); // user-input-desc
      console.log(JSON.parse(test));

      // set those values in the form fields
      $userInputTitle.val(e.target.dataset.storageKey);
      $userInputDesc.val(localStorage.getItem(e.target.dataset.storageKey));
    });

  });


  /*
  REMOVED: Delete Button

  $(".del-text-btn").on("click", function() {
    alert('item deleted? check the console'); // maybe change to a window.confirm
    localStorage.removeItem( $('.user-input-title').val() ); // grab the title and plop here
    $userInputTitle.val("");
    $userInputDesc.val("");
  });
  */


  /*
  Add Category Button Functionality
  Prompts users to create a new catgeory and appends it to the end of the category list 
  */
  $categoryRow.on("click", ".add-category-item", function() {
    var category = prompt('Category Name');
    addNewCategory(category);
  });


  /*
  Category Button Functianality
  Clicking on a category opens the list of items contained within that category
  */
  $categoryRow.on('click', '.category-item', function(event){
    var category = event.target.innerHTML;
    
    //Remove Category from list functionality
    // if ($("select").val() === category) {
    //   resetDropboxDisplay();
    // }

    // removeFromCategoryList(category);
    // removeFromCategoryDropdown(category);
    // popFromCategoryArray(category);

  //Enter Category Page Functionality || THIS IS STATIC
    $categoryRow.html(`
    <div class="category-details">
    <div id="title">${category}</div>
    <div id="close">X</div>
    <div class="item-list">
      <div class="item" id="catcher-in-the-rye">Catcher In The Rye</div>
      <div class="item" id="the-bible">The Bible</div>
      <div class="item" id="meditations">Meditations</div>
    </div>
  </div>
    `);

  });

  $("select").on("click", "#add-category", function(){
    var category = prompt('Category Name');
    addNewCategory(category);
  });


  /*
  Hover over animation for category items
  Enlarges font size by .15em on hover and returns to original on complete
  POSSIBLE IDEA: Change bg color/opacity
  */
  // $categoryRow.on({
  //   mouseenter: function() {
  //     if (!$(this).hasClass('animated')) { 
  //       $(this).dequeue().stop().animate({ 
  //         fontSize: "1.15em"
  //       }, "300", "swing")
  //     }
  //   }, 
    
  //   mouseleave: function() {
  //     $(this).addClass('animated').animate({ 
  //         fontSize: "1em" 
  //       }, "500", "swing", function() {
  //         $(this).removeClass('animated').dequeue();
  //       })
  //   }
  // }, ".category-item");
    
  // $categoryRow.on({
  //   mouseenter: function() {
  //     if (!$(this).hasClass('animated')) { 
  //       $(this).dequeue().stop().animate({ 
  //         fontSize: "2.8em"
  //       }, "300", "swing")
  //     }
  //   }, 
    
  //   mouseleave: function() {
  //     $(this).addClass('animated').animate({ 
  //         fontSize: "2em" 
  //       }, "500", "swing", function() {
  //         $(this).removeClass('animated').dequeue();
  //       })
  //   }
  // }, ".add-category-item");
  
  /*
  Category Container Close Button
  X button at the top right of the category title. On click returns user
  back to the category list
  */
  $categoryRow.on('click', '#close', function() {
    $categoryRow.html('').append('<div class="category-container"><div class="add-category-item" id="add-category">+</div>')
    populateCategoryList(); 
  });

});