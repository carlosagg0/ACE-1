import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-listacostos',
  templateUrl: './listacostos.page.html',
  styleUrls: ['./listacostos.page.scss'],
})
export class ListacostosPage implements OnInit {
  formVisible = false;

  constructor() {}

  toggleForm() {
    this.formVisible = !this.formVisible;
  }

  ngOnInit() {
  }

}
