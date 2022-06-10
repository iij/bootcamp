def apply(quantity: int):
    if not isinstance(quantity, int):
        raise TypeError()

    if quantity < 10 or  100 < quantity:
        return 'not accepted'

    return 'accepted'
