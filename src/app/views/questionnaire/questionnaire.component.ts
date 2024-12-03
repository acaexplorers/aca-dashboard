import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-questionnaire',
  templateUrl: './questionnaire.component.html',  // Template URL to external HTML
  styleUrls: ['./questionnaire.component.scss']
})
export class QuestionnaireComponent {
  @Input() questions: string[] = [];
  @Output() answersEvent = new EventEmitter<string[]>();

  currentQuestionIndex = 0;
  answers: string[] = [];

  nextQuestion(): void {
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
    }
  }

  previousQuestion(): void {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
    }
  }

  submitAnswers(): void {
    this.answersEvent.emit(this.answers); // Emit answers to the parent component
  }
}
