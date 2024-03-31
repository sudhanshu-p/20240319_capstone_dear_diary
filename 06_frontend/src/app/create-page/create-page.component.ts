import { Component, ElementRef, ViewChild } from '@angular/core';
import { MarkdownService } from 'ngx-markdown';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { MatTabChangeEvent } from '@angular/material/tabs';

@Component({
  selector: 'app-create-page',
  templateUrl: './create-page.component.html',
  styleUrl: './create-page.component.css'
})
export class CreatePageComponent {
  @ViewChild('toggleCheckbox') toggleCheckbox: ElementRef | undefined;
  @ViewChild('usernameCheckbox') usernameCheckbox: ElementRef<HTMLInputElement> | undefined;

  getUsernameAnonymousValue(): string {
    if (this.usernameCheckbox && this.usernameCheckbox.nativeElement.checked) {
      return 'Username';
    } else {
      return 'Anonymous';
    }
  }
  selectedTabLabel = 'Journal'; // Initial selected tab (optional)
  showPrivacyToggles = true; // Initial visibility state
  isPublic = true; // Initial state: Public selected

  currentTabIndex = 0;
  onTabChange(event: MatTabChangeEvent) {
    this.selectedTabLabel = event.index === 0 ? 'Journal' : event.tab.textLabel;
    this.showPrivacyToggles = this.selectedTabLabel === 'Journal';
    this.currentTabIndex = event.index;
  }

  onPrivacyChange(isPublic: boolean) {
    this.isPublic = isPublic;
  }

  blogTitle: string = ''
  blogContent: string = '';
  private: boolean = true;

  postSaved: boolean = false;

  constructor(
    private markdownService: MarkdownService,
    private authService: AuthService,
    private router: Router
  ) { }

  insertMarkdown(prefix: string, helperText: string, suffix: string) {
    const textareaEl = document.querySelector('textarea');

    if (textareaEl) {
      const textarea = textareaEl as HTMLTextAreaElement;
      // Start represents the index of textarea before selection
      const start = textarea.selectionStart;
      // End represents the index of textarea after selection
      const end = textarea.selectionEnd;


      const selectedText = this.blogContent.substring(start, end);

      // If some text is selected, ignore helper
      if (selectedText) {
        const newText = `${prefix}${selectedText}${suffix}`;
        this.blogContent =
          this.blogContent.substring(0, start) +
          newText +
          this.blogContent.substring(end);
      }
      // Else add Helper 
      else {
        this.blogContent =
          this.blogContent.substring(0, start) +
          prefix +
          helperText +
          suffix +
          this.blogContent.substring(end);
      }

      textarea.selectionStart = textarea.selectionEnd = start + prefix.length;
      textarea.focus();
    }
  }

  savePost() {
    // Calling the POST API
    if (!this.toggleCheckbox) {
      return
    }
    const isPrivate = this.toggleCheckbox.nativeElement.checked;
    const dataToBeSent = {
      "title": this.blogTitle,
      "content": this.blogContent,
      "visibility": isPrivate ? "private" : "public",
      "posttype": ["Journal", "Collaberative", "Daily Journal", "Habit Tracker"],
      "anonymous": this.getUsernameAnonymousValue() === "Anonymous"? true : false,
    }
    this.authService.makeRequest(`page`, 'post', true, { body: dataToBeSent })
      .subscribe(
        (response) => {
          console.log(response)
          this.router.navigate([`/pages/${response.url}`])
        },
        (error) => {
          console.error(error)
        }
      )
  }

  openFileInput() {
    console.log("File input opened")
  }

  handleImageUpload() {
    console.log("File input opened")
  }
}
