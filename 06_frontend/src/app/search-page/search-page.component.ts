import { Component } from '@angular/core';

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styleUrl: './search-page.component.css'
})
export class SearchPageComponent {
  blog: blogMetadata = {
    title: "Implementing Credential-based Authentication with SvelteKit and MongoDB",
    description: "Instructions on how to implement Authentication with SvelteKit with MongoDB as the Database",
    date: new Date('2023-01-23T19:34:00')
  }
}
