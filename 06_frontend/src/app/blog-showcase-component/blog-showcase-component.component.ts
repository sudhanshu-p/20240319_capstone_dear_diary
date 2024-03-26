import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-blog-showcase-component',
  templateUrl: './blog-showcase-component.component.html',
  styleUrl: './blog-showcase-component.component.css'
})
export class BlogShowcaseComponentComponent {
  @Input()
  blog: blogMetadata = {
    title: "Sample text",
    description: "Sample description",
    date: new Date('2023-01-23T19:34:00')
  }

  TITLE_MAX_LENGTH = 100
  DESCRIPTION_MAX_LENGTH = 250

  formatDate(date: Date) {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const year = date.getFullYear();
    const month = months[date.getMonth()];
    const day = date.getDate();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = date.getHours() >= 12 ? 'PM' : 'AM';

    return `${month} ${day}, ${year} | ${hours}:${minutes} ${ampm}`;
  }

  trimString(str: String, maxLength: number): String {
    // Return the original string if it's already shorter than the maximum length
    if (str.length <= maxLength) {
      return str;
    }

    // Trim the string and add an ellipsis (...) at the end
    return str.slice(0, maxLength) + '...';
  }
}
