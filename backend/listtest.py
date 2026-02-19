from typing import List
l :List[str] = []
for _ in range(3):
    user_input = input("Enter a string to be appended: ")
    l.append([user_input])

print("List will look like: ", type(l))