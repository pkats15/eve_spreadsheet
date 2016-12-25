//Runs on change
function onChange() {
  var ss = SpreadsheetApp.getActiveSpreadsheet()
  var sheet = ss.getSheetByName("Main")
  var r = getNamedRange("Update")
  
  //If Y or y is placed in update field update
  if (r.getValue() == "Y" || r.getValue() == "y"){
    r.setValue("")
    setStatus("Updating")
    main()
    setStatus("Done")
  }else if (r.getValue() == "C" || r.getValue() =="c"){
    r.setValue("")
    setStatus("Copying...")
    copyToSort()
    setStatus("Done")
  }
  
  //update(sheet)
}

function setStatus(info){
  getNamedRange("Status").setValue(info)
}

function getNamedRange(name) {
  for(var i=0; i<SpreadsheetApp.getActiveSpreadsheet().getNamedRanges().length; i++) {
    if(SpreadsheetApp.getActiveSpreadsheet().getNamedRanges()[i].getName() == name){
      return SpreadsheetApp.getActiveSpreadsheet().getNamedRanges()[i].getRange()
    }
  }
  return false
}

//Moves items from select sheet (Main) to working sheet (TEST) to allow sorting without breaking things
function moveItems(){
  //Backup in case this function does not work
  //=ARRAYFORMULA(Main!A4:B)
  var ss = SpreadsheetApp.getActiveSpreadsheet()
  var item_num = findColLength(ss.getSheetByName("Main").getRange("A4:A").getValues())
  var source=ss.getSheetByName("Main").getRange("A4:A")
  var destination=ss.getSheetByName("TEST").getRange("A2:A")
  for(var i=0;i<item_num;i++){
    destination.getCell(i+1, 1).setValue(source.getCell(i+1, 1).getValue())
  }
}

//Main function
function main() {
  var ss = SpreadsheetApp.getActiveSpreadsheet()
  var items = getNamedRange("ItemsToWatch") 
  var region = getNamedRange("RegionsToWatch").getCell(1,1).getValue()
  var item_num = findColLength(ss.getSheetByName("Main").getRange("A4:A").getValues()) //Number of items to be watched
  //TEMP
  //moveItems()  //To decide if it is worth it
  //TEMP
  for(var i=0;i<item_num;i++){
    setStatus("Updating item #"+String(i+1))
    mb = getMaxBuy(items.getCell(i+1,1).getValue(),region)
    ms = getMinSell(items.getCell(i+1,1).getValue(),region)
    ss.getSheetByName("TEST").getRange(i+2, 4).setValue(mb.price)
    ss.getSheetByName("TEST").getRange(i+2, 5).setValue(ms.price)
  }
}

function update(sheet){
  var id = 2621;
  var region = 10000043;
  var item1 = getMaxBuy(id, region)
  var item2 = getMinSell(id, region)
  sheet.getRange("B3").setValue(item1.price)
  sheet.getRange("B4").setValue(item2.price)
}

//Copies all the data from the TEST sheet
//to TESTSORT so it can be easily sorted
function copyToSort(){
  var test_sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("TEST")
  var test_sort = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("TESTSORT")
  var len = findColLength(test_sheet.getRange(1, 1, 1000).getValues())
  Logger.log(len)
  var values = test_sheet.getRange(1, 1, len, 9).getValues()
  test_sort.clearContents()
  test_sort.getRange(1,1, len, 9).setValues(values)
}

//Debugging function
//Used as entry-point for debugging
function test(){

}

function getMinSell(item, region){
  var url = "https://crest-tq.eveonline.com/market/" + String(region) + "/orders/sell/" + "?type=https://crest-tq.eveonline.com/inventory/types/" + item +"/"
  var resp = UrlFetchApp.fetch(url);
  var data = JSON.parse(resp)
  var items = data.items
  items.sort(cmp)
  return items[0]
}

function getMaxBuy(item, region){
  var url = "https://crest-tq.eveonline.com/market/" + String(region) + "/orders/buy/" + "?type=https://crest-tq.eveonline.com/inventory/types/" + item +"/"
  var resp = UrlFetchApp.fetch(url);
  var data = JSON.parse(resp)
  var items = data.items
  items.sort(reverseCmp)
  return items[0]
 }

function cmp(a, b){
  return a.price - b.price
}
  
function reverseCmp(a, b){
  return -cmp(a,b)
}

//Finds the length of a collumn.
//Use instead of the built-in global function
function findColLength(arr) {
  var last = arr.length;
  var b = 0;
  var i = 0;
  for (i; i<=last; i++) {
    if (arr[i]==""||arr[i]==null) { b = i; break; }
  }
  return b;
}