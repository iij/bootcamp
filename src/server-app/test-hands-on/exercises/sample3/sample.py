import random


def _my_shoot():
    choices = ["rock", "paper", "scissors"]
    return random.choice(choices)


def rock_paper_scissors(shoot):
    # 1/3で"rock", "paper", "scissors"が格納される
    my_shoot_result = _my_shoot()

    # あいこ
    if shoot == my_shoot_result:
        return 0

    # 勝利
    if shoot == "rock" and my_shoot_result == "scissors":
        return 1
    if shoot == "paper" and my_shoot_result == "rock":
        return 1
    if shoot == "scissors" and my_shoot_result == "paper":
        return 1

    # 敗北
    return -1
