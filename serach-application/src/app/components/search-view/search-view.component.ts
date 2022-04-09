import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { University } from 'src/app/models/university';
import { SearchLogicService } from 'src/app/services/search-logic.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-search-view',
  templateUrl: './search-view.component.html',
  styleUrls: ['./search-view.component.scss']
})
export class SearchViewComponent implements OnInit, OnDestroy {

  public displayedColumns: string[] = [
    'country',
    'name',
    'alpha_two_code',
    'web_pages',
    'domains',
    'state_province',
  ];
  public universities: University[] = [];

  public dataSource: MatTableDataSource<University>  = new MatTableDataSource();

  private paginator: MatPaginator | undefined;
  private sort: MatSort | undefined;

  @ViewChild(MatPaginator)
  set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.dataSource.paginator = this.paginator;
  }

  @ViewChild(MatSort)
  set matSorting(ms:MatSort) {
    this.sort = ms;
    this.dataSource.sort = this.sort;
  }

  public isNotEmpty: boolean = false;

  constructor(public searcher: SearchLogicService) {
    this.dataSource = new MatTableDataSource(undefined);
  }

  ngOnInit(): void {

    this.searcher.universitiesCollection.subscribe(items => {
      this.isNotEmpty = items.length > 0;
      this.universities = items;
      this.dataSource = new MatTableDataSource(items);
    });

  }

  ngOnDestroy(): void {
    this.searcher.universitiesCollection.unsubscribe();
  }

  drop(event: CdkDragDrop<any[]>) {
     moveItemInArray(this.displayedColumns, event.previousIndex, event.currentIndex);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
