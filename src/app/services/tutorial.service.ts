import { Injectable } from '@angular/core';
import { ShepherdService } from 'angular-shepherd';

@Injectable({
  providedIn: 'root',
})
export class TutorialService {
  tutorial: boolean;

  constructor(private shepherdService: ShepherdService) {}

  setDefaultStepOptions() {
    this.shepherdService.defaultStepOptions = {
      scrollTo: false,
      cancallcon: {
        enabled: true,
      },
    };
    this.shepherdService.modal = true;
    this.shepherdService.confirmCancel = false;
  }

  getTutorialStep(
    title: string,
    text: string,
    buttonPattern: string,
    element: string,
    on: string
  ): {
    title: string;
    text: string;
    buttons: { classes: string; text: string; type: string }[];
    attachTo: { element: string; on: string };
  } {
    const cancelButton: { classes: string; text: string; type: string } = {
      classes: 'shepherd-button-secondary',
      text: '閉じる',
      type: 'cancel',
    };
    const backButton: { classes: string; text: string; type: string } = {
      classes: 'shepherd-button-primary',
      text: '戻る',
      type: 'back',
    };
    const nextButton: { classes: string; text: string; type: string } = {
      classes: 'shepherd-button-primary',
      text: '進む',
      type: 'next',
    };
    // 初期化
    const buttons: { classes: string; text: string; type: string }[] = [
      cancelButton,
    ];
    switch (buttonPattern) {
      case 'cancel':
        buttons.push(cancelButton);
        break;
      case 'last':
        buttons.push(backButton);
        break;
      case 'first':
        buttons.push(nextButton);
        break;
      case 'each':
        buttons.push(backButton, nextButton);
        break;
    }
    return {
      title,
      text,
      buttons,
      attachTo: {
        element,
        on,
      },
    };
  }

  startEditTutorial() {
    this.setDefaultStepOptions();
    this.shepherdService.addSteps([
      this.getTutorialStep(
        '1つ目のOKR作成するよ！！',
        'さっそく、使い方を説明していきます！',
        'first',
        null,
        'bottom'
      ),
      this.getTutorialStep(
        'フォームに入力しよう！',
        'ますは、なりたい姿を入力しよう！',
        'last',
        '.okr-edit',
        'bottom'
      ),
    ]);
    this.shepherdService.start();
  }

  secondStepEditTutorial() {
    this.tutorial = true;
    this.setDefaultStepOptions();
    this.shepherdService.addSteps([
      this.getTutorialStep(
        '1つ目のOKR作成するよ！！',
        'なりたい姿はどうしたら達成できるかな？',
        'first',
        null,
        'bottom'
      ),
      this.getTutorialStep(
        '1つ目のOKR作成するよ！！',
        '3つ考えて入力しよう！',
        'each',
        '.second-okr-form',
        'bottom'
      ),
      this.getTutorialStep(
        '1つ目のOKR作成するよ！！',
        'ここでフォームを追加できるよ！',
        'each',
        '.add-form',
        'bottom'
      ),
      this.getTutorialStep(
        '1つ目のOKR作成するよ！！',
        '入力したらOKRを作成しよう！',
        'last',
        '.create-okr-button',
        'bottom'
      ),
    ]);
    this.shepherdService.start();
  }

  firstStepSecondOkrEditTutorial() {
    this.setDefaultStepOptions();
    this.shepherdService.addSteps([
      this.getTutorialStep(
        '2つ目のOKRを作成するよ！',
        'これから2つ目のOKR作成を作成するよ！',
        'first',
        null,
        'bottom'
      ),
      this.getTutorialStep(
        '2つ目のOKR作成するよ！',
        '1つ目のOKRで作成した、KeyResults(目標達成のための成果指標)を参考にして目標を作成しよう！',
        'each',
        '.second-okr-form',
        'bottom'
      ),
      this.getTutorialStep(
        '2つ目のOKR作成するよ！',
        'ここで目標を追加できるよ！',
        'last',
        '.add-form',
        'bottom'
      ),
    ]);
    this.shepherdService.start();
  }

  secondStepSecondOkrEditTutorial() {
    this.tutorial = true;
    this.setDefaultStepOptions();
    this.shepherdService.addSteps([
      this.getTutorialStep(
        '2つ目のOKR作成するよ！！',
        '始める日付と終わりの日付を入力しよう！',
        'each',
        '.second-okr-callender',
        'bottom'
      ),
      this.getTutorialStep(
        '2つ目のOKR作成するよ！！',
        '入力できたら2番目のOKRを作成しよう！',
        'last',
        '.create-secondOkr',
        'bottom'
      ),
    ]);
    this.shepherdService.start();
  }

  startOkrTutorial() {
    this.setDefaultStepOptions();
    this.shepherdService.addSteps([
      this.getTutorialStep(
        'OKR管理画面です！',
        'OKRが作成されたよ！',
        'first',
        null,
        'bottom'
      ),
      this.getTutorialStep(
        'OKR管理画面です！',
        '変更もできるよ！',
        'each',
        '.okr',
        'bottom'
      ),
      this.getTutorialStep(
        'OKR管理画面です！',
        '次は2つ目のOKRを作成しよう！',
        'last',
        '.start-second-okr-edit',
        'bottom'
      ),
    ]);
    this.shepherdService.start();
  }

  secondOkrTutorial() {
    this.setDefaultStepOptions();
    this.shepherdService.addSteps([
      this.getTutorialStep(
        '作業管理画面だよ！',
        'おめでとう！2つ目のOKRが作成されたよ！',
        'first',
        null,
        'bottom'
      ),
      this.getTutorialStep(
        '作業管理画面だよ！',
        '目標はいつでも変更できるよ！',
        'each',
        '.objective',
        'bottom'
      ),
      this.getTutorialStep(
        '作業管理画面だよ！',
        '目標を達成するための作業を数字を使って作成しよう！',
        'each',
        '.item',
        'bottom'
      ),
      this.getTutorialStep(
        '作業管理画面だよ！',
        '項目に書いた数字を書くよ！',
        'each',
        '.target',
        'bottom'
      ),
      this.getTutorialStep(
        '作業管理画面だよ！',
        '達成した数字を書くよ！',
        'each',
        '.current',
        'bottom'
      ),
      this.getTutorialStep(
        '作業管理画面だよ！',
        '達成率は自動で更新されるよ！',
        'each',
        '.percent',
        'bottom'
      ),
      this.getTutorialStep(
        'さあ、はじめよう！',
        'レコードを追加してはじめてみよう！',
        'last',
        '.add-row',
        'bottom'
      ),
    ]);
    this.shepherdService.start();
  }
}
