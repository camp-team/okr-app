import { Injectable } from '@angular/core';
import { ShepherdService } from 'angular-shepherd';

@Injectable({
  providedIn: 'root',
})
export class TutorialService {
  tutorial: boolean;
  parentOkrTutorial: boolean;

  tutorialSteps = {
    rootOkr: {},
    childOkr: {
      createScreen: [
        [
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
            '次は、タスクを作成しよう！',
            'last',
            '.start-child-okr-edit',
            'bottom'
          ),
        ],
        [
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
            '.child-okr-form',
            'bottom'
          ),
          this.getTutorialStep(
            '2つ目のOKR作成するよ！',
            'ここで目標を追加できるよ！',
            'last',
            '.add-form',
            'bottom'
          ),
        ],
        [
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
            '作業管理画面だよ！',
            'レコードを追加してタスクを増やせるよ！',
            'each',
            '.add-row',
            'bottom'
          ),
          this.getTutorialStep(
            'さあ、はじめよう！',
            '目標達成目指して頑張ろう！',
            'last',
            '.key',
            'bottom'
          ),
        ],
      ],
    },
    parentOkr: {
      createScreen: [
        [
          this.getTutorialStep(
            'カテゴリー',
            'OKRの対象は自由です',
            'first',
            '.category',
            'right'
          ),
          this.getTutorialStep(
            'Key result',
            '目標は3つがおすすめです。',
            'end',
            '.objective-form',
            'right'
          ),
        ],
      ],
    },
  };

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
      classes: 'shepherd-button-childary',
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

  startTutorial(params: { okrType: string; groupIndex: number }) {
    this.shepherdService.addSteps(
      this.tutorialSteps[params.okrType].createScreen[params.groupIndex]
    );
    this.shepherdService.start();
  }
}
