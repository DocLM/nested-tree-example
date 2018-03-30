import { Component, OnDestroy, Input, EventEmitter, Output } from '@angular/core';
import { Item, ItemNode, FileDatabase } from './file-database';
import { MatTreeNestedDataSource } from "@angular/material";
import { NestedTreeControl } from "@angular/cdk/tree";
import { Subscription } from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [ FileDatabase ]
})
export class AppComponent {
  private database: FileDatabase;
  private databaseSubscription: Subscription;

  public treeControl: NestedTreeControl<ItemNode>;

  public treeDataSource: MatTreeNestedDataSource<ItemNode>;

  @Output()
  public onItemSelection: EventEmitter<Item>;

  constructor(database: FileDatabase ) {
    this.database = database;
    this.onItemSelection = new EventEmitter<Item>();

    this.treeControl = new NestedTreeControl<ItemNode>(this.getChildren);
    this.treeDataSource = new MatTreeNestedDataSource<ItemNode>();

    this.databaseSubscription = this.database.dataChange
    .subscribe(root => {
      this.treeDataSource.data = root;
    });

    this.database.initialize();
  }

  public getChildren = (node: ItemNode) => {
    return node.children;
  };

  public hasNestedChild = (_: number, nodeData: ItemNode) => {
    return nodeData.hasChildren
  };

  public loadChildren(node: ItemNode) {
    this.database.loadMore(node.item);
  }

  public itemClick(item: Item)
  {
    this.onItemSelection.emit(item);
  }

  public ngOnDestroy() {
    this.databaseSubscription.unsubscribe();
  }
}
