def ratio_from_avg(low, high, avg):
    a = (high-avg)/(avg-low)
    return a

print(ratio_from_avg(17901082, 32995000, 31378000))
