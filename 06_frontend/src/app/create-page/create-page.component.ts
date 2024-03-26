import { Component, ElementRef, ViewChild } from '@angular/core';
import { MarkdownService } from 'ngx-markdown';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-page',
  templateUrl: './create-page.component.html',
  styleUrl: './create-page.component.css'
})
export class CreatePageComponent {
  @ViewChild('toggleCheckbox') toggleCheckbox: ElementRef | undefined;

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
      "visibility": isPrivate ? "private" : "public"
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
