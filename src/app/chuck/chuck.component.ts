import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import {MatPaginator} from '@angular/material';
import {MatTableDataSource} from '@angular/material';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-chuck',
  templateUrl: './chuck.component.html',
  styleUrls: ['./chuck.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ChuckComponent implements OnInit {

  displayedColumns = ['position'];
  dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  categories:any;
  joke:any;
  message:any;
  random:any;
  category: string;
  searchValue: string;
  generator: boolean = false;
  text: boolean = false;
  search: boolean = true;
  jokes = [];
  constructor(private http: HttpClient) { }

  ngOnInit() {
    //on page load we get all categories from api Object
    this.http.get('https://api.chucknorris.io/jokes/categories').subscribe(categories => {
      this.categories = categories;
    });
    //on page load we show random Joke right away
    this.onNewMessage ();
  }
  // getting random joke
  onNewMessage (){
    this.http.get('https://api.chucknorris.io/jokes/random').subscribe(message => {
      this.message = message;
    });
  }
  //getting random joke when user clicks on button "suprise me"
  onRandomTest(){
    this.http.get('https://api.chucknorris.io/jokes/random').subscribe(randomTest => {
      this.random = randomTest;
      console.log(randomTest);
      }
    );
  }
//assinging selected category to variable this.category
  onChange(category) {
    this.category = category;
    console.log(category);
  }
// getting radom joke from selected category
  onCategory() {
    this.http.get('https://api.chucknorris.io/jokes/random?category='+this.category).subscribe(joke => {
      this.joke = joke;
      this.text = true;
    });
  }
//capturing event change on input field
  onSearchChange(sValue){
  this.searchValue = sValue;
 }
//onkeydown search starts
 onKeydown(event) {
  this.onSearch();
}

// onclick search starts
  onSearch(){
      this.http.get('https://api.chucknorris.io/jokes/search?query='+this.searchValue).subscribe(jokes => {
        this.jokes = [];
        if (jokes["total"] === 0) {
          this.jokes.push({value: "try again"});
          this.dataSource = new MatTableDataSource(this.jokes)
        } else {
          this.jokes = jokes["result"];
          console.log(jokes);
          this.dataSource = new MatTableDataSource(jokes["result"]);
    }
    this.dataSource.paginator = this.paginator;
    });
  }
  //if search is invalid we add style to "try again" text
  getColor(element){
      if (element === "try again"){
        return 'red'
      } else{
        return 'black'
      }
 }
}
