//Update Storage Prototype to accept Objects
Storage.prototype.setObject = function(key, value) {
  this.setItem(key, JSON.stringify(value));
}

Storage.prototype.getObject = function(key) {
  return JSON.parse(this.getItem(key));
}
 
//Default Test Data
var categoryList = ['Books', 'Recipes', 'Movies', 'Restaurants'];
var books = {
  'Great Gatsby': {
    description: 'This is a good book'
  },

  'The Bible' : {
    description: 'epic'
  },

  'Meditations': {
    description: 'marcus'
  }
};

var recipes = {
  'Apple Pie': {
    description: 'Yummy'
  },

  'Pizza Pie': {
    description: 'Cheese, Sauce, and dough'
  }
}
var movies = {};
var restaurants = {};

localStorage.setObject('categoryList', categoryList);
localStorage.setObject('Books', books);
localStorage.setObject('Recipes', recipes);
localStorage.setObject('Restaurants', restaurants);
localStorage.setObject('Movies', movies);



// Item Class Prototype
function Item(name, description, category) {
    var name = name;
    this[name] = {'description': description };
};

//Searches Local Storage for matching Item Object and returns if found
var searchLocalStorage = function(term) {
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

//Add New Item to Local Storage
var addNewItem = function(name, description, category) {
  category = formatString(category);
  name = formatString(name);
  
  if (localStorage.getObject(category) != null) {
    var item = localStorage.getObject(category);
    if (!Object.keys(item).includes(name)) {
      item[name] = { 'description': description }
      localStorage.setObject(category, item);
    } else {
      alert(name + ' already exists!');
      return false;
    } 
  } else {
    var item = new Item(name, description, category);
    localStorage.setObject(category, item);
  }
  return true;
};

var getItemDescription = function(name, category) {
  if (localStorage.getObject(category)) {
    var item = localStorage.getObject(category);
    for (var prop in item) {
      if (prop === name) {
        return item[prop].description;
      }
    }
  } 
};

var updateItemName = function(name, category, newName) {
  if (localStorage.getObject(category)) {
    var item = localStorage.getObject(category);
    for (var prop in item) {
      if (prop === name) {
        var storedProp = item[prop];
        item[newName] = storedProp;
        delete item[name];
        localStorage.setObject(category, item);
      }
    }
  }
};

var updateItemDescription = function(name, category, newDescription) {
  if (localStorage.getObject(category)) {
    var item = localStorage.getObject(category);
    for (var prop in item) {
      if (prop === name) {
        item[prop].description = newDescription;
        localStorage.setObject(category, item);
      }
    }
  } 
};

var isCategoryEmpty = function(category) {
  if (localStorage.getObject(category) === null || Object.keys(localStorage.getObject(category)).length === 0) {
    $(".item-list").append(`<div class="item-holder">You should really add something!</div>`);
  } else {
    return false;
  }
};

var removeItem = function(name, category) {
  if (!isCategoryEmpty(category)) {
    var item = localStorage.getObject(category);
    if (Object.keys(item).includes(name)) {
      delete item[name];
      localStorage.setObject(category, item);
    }
  }
};

//Updates categoryList with string when user adds a new category
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

//Removes category string from categoryList
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

//Category List Functions
var populateCategoryList = function() {
  for (var category of categoryList) {
    $(".category-container").append(`<button class="category-item">${category}</div>`)
  }
};

var addToCategoryList = function (category) {
  $(".category-container").append(`<button class="category-item">${category}</div>`);
};

var removeFromCategoryList = function(category) {
  if (categoryList.includes(category)) {
    $(`button.category-item:contains(${category})`).remove();
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
var createNewCategoryObject = function(category) {
  localStorage.setObject(category, {});
};

var addNewCategory = function(category) {
  if (category !== null) {
    if (category !== '') {
      category = formatString(category);
      if (pushToCategoryArray(category)) {
        addToCategoryDropdown(category);
        addToCategoryList(category);
        createNewCategoryObject(category);
      }
    } else {
      console.log('Category is EMPTY/NULL')
    }
  }
};

var resetDropdownBox = function() {
  $("select").prop('selectedIndex', '#select-category');
};


/* 
jQuery Begins
*/
$(document).ready(function() {
  resetDropdownBox();
  populateCategoryList();
  populateCategoryDropdown();
  /*
  Selector variables
  */
  var $inputSearchBar = $("input.search-bar");
  var $addTextBtn = $(".add-text-btn");
  var $displayItem = $(".item");
  var $addCategoryItem = $("button.add-category-item");
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
  //Click box shadow effect
  $addTextBtn.on('mousedown', function() {
    $(this).css({"box-shadow":"1px 1px"})
  });

  $addTextBtn.on("click", function(){
    //Resets click box shadow effect
    $(this).css({"box-shadow":""});

    let name = $(".user-input-title").val();
    let description = $(".user-input-desc").val();
    let category = $("select").val();

    if (category === null) {
      alert('You gotta pick a category!')
    } else {
      if (addNewItem(name, description, category)) {
        if ($("div.category-details")[0].id === category) {
          if ($(".item-holder")) {
            $(".item-holder").remove();
          }   
          $(".item-list").append(`<div class="item" id="${category}">${name}<span class="description">${description}</span><span class="settings" style="opacity: 0;"><i class="fas fa-bars"></i></span></div>`);
        } else {
          alert(`Added ${name} to ${category}`)
        }
      }
    }

    // Clear/Reset Item Entry Forms
    $(".user-input-title").val("");
    $(".user-input-desc").val("");
    resetDropdownBox();

  });

  /*
  Add Category Button Functionality
  Prompts users to create a new catgeory and appends it to the end of the category list 
  */
  $categoryRow.on('mousedown', 'button.add-category-item', function() {
    $(this).css({"box-shadow":"1px 1px"})
  });

  $categoryRow.on("click", "button.add-category-item", function() {
    $(this).css({"box-shadow":""})
    var category = prompt('Category Name');
    addNewCategory(category);
  });

  /*
  Category Button Functianality
  Clicking on a category opens the list of items contained within that category
  */
  $categoryRow.on('mousedown', 'button.category-item', function() {
    $(this).css({"box-shadow":"1px 1px"})
  });

  $categoryRow.on('click', 'button.category-item', function(event){
    $(this).css({"box-shadow":""})
    var category = event.target.innerHTML;
    $categoryRow.html(`
    <div class="category-details" id="${category}">
    <button id="close"><i class="fas fa-chevron-left"></i></button>
    <div id="title">${category}</div>
    <div class="item-list">
    </div>
    </div>
    `); 
      
    if (!isCategoryEmpty(category)) {
      var item = localStorage.getObject(category);
      for (var key in item) {
        var description = getItemDescription(key, category);
        $(".item-list").append(`<div class="item" id="${category}">${key}<span class="description">${description}</span><span class="settings" style="opacity: 0;"><i class="fas fa-bars"></i></span></div>`);
      }
    }

  //Remove Category from list functionality
  //THIS NEEDS TO BE PUT SOMEWHERE
  // if ($("select").val() === category) {
  //   resetDropdownBox();
  // }

  // removeFromCategoryList(category);
  // removeFromCategoryDropdown(category);
  // popFromCategoryArray(category);

  //Enter Category Page Functionality
  //THIS IS HARDCODED NEEDS TO BE DYNAMIC
 
  });

  $("select").on("click", "#add-category", function(){
    var category = prompt('Category Name');
    addNewCategory(category);
  });

  /*
  Category Container Close Button
  X button at the top right of the category title. On click returns user
  back to the category list
  */
  $categoryRow.on('click', '#close', function() {
    $categoryRow.html('').append('<div class="category-container"><button class="add-category-item" id="add-category">+</div>')
    populateCategoryList(); 
  });

  /*
  Item Click Functionality 
  When user clicks on display item brings up edit and delete options
  */
 
  $categoryRow.on("mouseover", ".item", function(event) {
    var settingsBurger = event.target.childNodes[2];
    $(settingsBurger).css("opacity", ".3")

    $(settingsBurger).on('mouseover', function(){
      $(settingsBurger).css('opacity', '1')
    });
  });

  $categoryRow.on("mouseout", ".item", function(event){
    var settingsBurger = event.target.childNodes[2];
    $(settingsBurger).css("opacity", "0")
  });

  $categoryRow.on("click", ".settings", function(event) {
    var item = event.target.parentNode.previousSibling.previousSibling.data;
    var category = event.target.parentNode.parentNode.id;
    $('.settings').html('<i class="fas fa-pen" id="edit"></i><i class="far fa-trash-alt" id="delete"></i>')
    //updateItemName(item, category, 'Grate Slatsby');
    //updateItemDescription(item, category, 'the green light')

    // $('#edit').on('click', function(){

    // });

    $('#delete').on('click', function(){
      var confirm = window.confirm('Are you sure you want to delete ' + item);
      if (confirm) {
        $(`.item:contains(${item})`).remove()
        removeItem(item, category);
      }
      isCategoryEmpty(category);
    });

  });

  $categoryRow.on('mouseout', '.item', function(event) {
    //$(this.childNodes[2]).css( "opacity", "0" )
    //$('.settings').html('<i class="fas fa-bars"></i>')
  });

});