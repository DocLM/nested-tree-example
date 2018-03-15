import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

export class Item {
  public constructor(public name: string) {}
}

export class ItemNode {

  public children: BehaviorSubject<ItemNode[]> = new BehaviorSubject<ItemNode[]>([]);

  constructor(public item: Item,
              public hasChildren: boolean = false) {}
}

/**
 * A database that only load part of the data initially. After click on the box load other data.
 */
@Injectable()
export class FileDatabase {

  private dataMap = new Map([
    ['Fruits', ['Apple', 'Orange', 'Banana']],
    ['Vegetables', ['Tomato', 'Potato', 'Onion']],
    ['Apple', ['Fuji', 'Macintosh']],
    ['Onion', ['Yellow', 'White', 'Purple']]
  ]);

  rootLevelNodes = ['Fruits', 'Vegetables'];

  public dataChange: BehaviorSubject<ItemNode[]>;
  public nodeMap: Map<string, ItemNode>;

  constructor()
  {
    this.nodeMap = new Map<string, ItemNode>();
    this.dataChange = new BehaviorSubject<ItemNode[]>([]);
  }

  public initialize()
  {
    this.nodeMap.clear();

    const rootItems = this.rootLevelNodes.map(name => new Item(name));
    const rootNodes = rootItems.map( item => {
      let node = new ItemNode(item);
      if(this.dataMap.has(item.name) && this.dataMap.get(item.name).length)
        node.hasChildren = true;

      return node;
    });

    rootNodes.forEach(node => this.nodeMap.set(node.item.name, node));
    this.dataChange.next(rootNodes);
  }

  loadMore(item: Item)
  {
    if (!this.nodeMap.has(item.name)) {
      return;
    }

    const node = this.nodeMap.get(item.name)!;
    if(!node.children.value.length) {
      const children = this.dataMap.get(node.item.name);
      const childrenNodes = children.map(child => {
        let itemNode = new ItemNode(new Item(child));
        if(this.dataMap.has(child) && this.dataMap.get(child).length)
          itemNode.hasChildren = true;

        return itemNode;
      });
      childrenNodes.forEach(node => this.nodeMap.set(node.item.name, node));
      node.children.next(childrenNodes);
    }
  }
}
