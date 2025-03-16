
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  // NOTE: you are free to modify this component

  private router = inject(Router)

  itemCount!: number

  ngOnInit(): void {
  }

  checkout(): void {
    this.router.navigate([ '/checkout' ])
  }
}
