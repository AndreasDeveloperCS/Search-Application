import { HttpClient, HttpParams } from '@angular/common/http';
import { University } from './../models/university';
import { map, Observable, Subject, Subscription } from 'rxjs';
import { Injectable, Output, EventEmitter, OnDestroy } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class SearchLogicService implements OnDestroy {
  private providedUrl: string = 'http://universities.hipolabs.com/search'

  public universities: Observable<University[]> = new Observable<University[]>();

  public searchUniversities: EventEmitter<University[]> = new EventEmitter<University[]>();

  @Output()
  public countries: EventEmitter<string[]> = new EventEmitter<string[]>();

  @Output()
  public countriesCollection: EventEmitter<University[]> = new EventEmitter<University[]>();


  @Output()
  public universitiesCollection: EventEmitter<University[]> = new EventEmitter<University[]>();
  private countrySubcription: Subscription | undefined;

  @Output()
  public validatedCountry: EventEmitter<number> = new EventEmitter<number>();

  constructor(private http: HttpClient) { }

  ngOnDestroy(): void {
    this.countrySubcription?.unsubscribe();
  }

  getCountries(searched: any){
    const value = searched;

    const params = new HttpParams()
          params.set('sortColumn', 'country');
          params.set('sort', 'country');
          params.set('orderBy', 'country');

    this.countrySubcription?.unsubscribe();

    this.countrySubcription = this.http.get<University[]>(this.providedUrl, { params: params, responseType: 'json',  }).subscribe((data) => {

      const unique = [...new Set(data.map(item => {
        return item.country
      }))].filter((item, index, array) => {
           return value ? item.toUpperCase().startsWith(value.toUpperCase()) : true;
      }).sort();

      this.validatedCountry.emit(unique.length);
      this.countries.emit(unique);

      return unique;

    });

    //// Alternative solution

    // return this.http.get<University[]>(this.providedUrl, { params: params, responseType: 'json'}).pipe(
    //   map((data: University[]) => {
    //     const unique = [...new Set(data.map(item => {
    //      return item.country;
    //     }))].filter((item, index, array) => {
    //           return value ? item.toUpperCase().startsWith(value.toUpperCase()) : true;
    //       }).sort();

    //     if(unique.length === 0)
    //         this.validatedCountry.emit(unique.length);

    //     this.countries.emit(unique);
    //     return unique;
    //   }), error => {
    //     return error;
    // });
  }

  getUniversities(searchingCountry: any){
    const value = searchingCountry;
    const path = value && !!isNaN(searchingCountry) ? `${this.providedUrl}?country=${value}` : this.providedUrl;

    this.universities = this.http.get<University[]>(path);

    this.universities.subscribe(univers => {
      this.universitiesCollection.emit(univers);
    });
  }

}
