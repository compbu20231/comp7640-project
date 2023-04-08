import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ScormService } from 'src/app/services/scorm.service';
declare const initSelect: any;

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss']
})
export class QuizComponent implements OnInit {

  quiz = [];
  currentIndex = 0;
  btnTexts = ["下一題", "提交答案", "上一題"];
  answerAll = false;
  userChoices = [];
  choices = [];
  isSubmit = false;
  isPass = false;

  constructor(private httpClient: HttpClient, private scormService: ScormService) { }

  ngOnInit(): void {

    initSelect();

    this.httpClient.get('./assets/data/quiz.json').toPromise().then((quiz: any) => {

      this.quiz = quiz.sort((a, b) => 0.5 - Math.random());

     // const shuffledArray = array.sort((a, b) => 0.5 - Math.random());

      console.log(quiz);

      this.userChoices = Array.from({ length: this.quiz.length }, (_, idx) => false);
      this.choices = this.userChoices;

      this.choices = this.choices.map( (c, k) => {
          return Array.from({ length: this.quiz[k].choices.length }, (_, idx) => false);
      });

      this.userChoices = this.userChoices.map( (c, k) => {
        return Array.from({ length: this.quiz[k].choices.length }, (_, idx) => false);
      });

      console.log(this.choices);

    });
  }

  moveQuestion(isForward) {

    if(isForward && this.currentIndex < (this.quiz.length - 1)) {
      this.currentIndex++;
    }

    if(!isForward && this.currentIndex > 0) {
      this.currentIndex--;
    }

    if(this.answerAll && (this.currentIndex + 1) == this.quiz.length && isForward) {
      this.checkScore();
      this.isSubmit = true;
    }
    console.log('this.userChoices', this.userChoices);
  }


  resetQuestion() {
    this.userChoices = Array.from({ length: this.quiz.length }, (_, idx) => false);
    this.userChoices = this.userChoices.map( (c, k) => {
      return Array.from({ length: this.quiz[k].choices.length }, (_, idx) => false);
    });
    this.quiz.forEach( q => q.userCorrect = false);
    this.isSubmit = false;
    this.currentIndex = 0;
  }

  checkAnserAll() {
     console.log('this.userChoices', this.userChoices);
    this.answerAll = this.userChoices.filter(uc => uc.filter(u => u).length > 0).length == this.userChoices.length;
  }

  checkScore() {
    this.quiz.forEach( (q,i) => q.userCorrect = this.arrayEquals(this.userChoices[i],q.answer));
    console.log('this.quiz', this.quiz );
    this.isPass = this.quiz.filter(u => u.userCorrect).length == this.quiz.length;
    const score = (this.quiz.filter(u => u.userCorrect).length / this.quiz.length) * 100;
    if(this.isPass) {
      this.scormService.complete(score);
    }
  }


  arrayEquals(a, b) {
    return Array.isArray(a) &&
        Array.isArray(b) &&
        a.length === b.length &&
        a.every((val, index) => val === b[index]);
  }

}
