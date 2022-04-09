import { University } from './../../models/university';
import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { SearchLogicService } from 'src/app/services/search-logic.service';
import { OnDestroy } from '@angular/core';


@Component({
  selector: 'app-search-control',
  templateUrl: './search-control.component.html',
  styleUrls: ['./search-control.component.scss']
})
export class SearchControlComponent implements OnInit, OnDestroy {

  public areTipsDisplayed:boolean = true;
  public countries: Observable<string[]> = new Observable<string[]>();
  public universityCollection  : Observable<University[]> = new Observable<University[]>();
  public countriesCollection: string[] = [];

  public _searchValue: string = '';
  subscription: any;
  subscriptionSearchCountryValidation: any;
  subscriptionCountry: any;
  public isEmptyList: boolean = false;

  public get searchValue() {
    return this._searchValue;
  }

  public set searchValue(value:any) {
    this._searchValue  = value;
  }

  constructor(public searcher: SearchLogicService) {

  }

  ngOnInit(): void {

    this.subscriptionCountry = this.searcher.countries.subscribe((countries) => {
      this.countriesCollection = countries;
    });
    this.subscriptionSearchCountryValidation = this.searcher.validatedCountry.subscribe((quantity) => {
      this.isEmptyList = quantity === 0;
    });

  }

  valuechange($event: any) {

    this.areTipsDisplayed = $event?.target?.value !== '' ?  true : false;

    this.searcher.getCountries($event?.target?.value);

  }

  valueSelected(event$: any) {

    this.searchValue = event$?.target?.textContent.trim();
    this.areTipsDisplayed = false;

  }

  async searchUniversities() {

    if(this.searchValue) {
      await this.searcher.getUniversities(this.searchValue.trim());
    }

  }

  ngOnDestroy () {
    this.subscription.dispose();
    this.subscriptionCountry.dispose();
    this.subscriptionSearchCountryValidation.dispose();
  }

}
