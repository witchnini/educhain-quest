(define-constant ERR_UNAUTHORIZED (err u100))
(define-constant ERR_INSUFFICIENT_BALANCE (err u101))
(define-constant ERR_ZERO_AMOUNT (err u102))

(define-data-var owner principal tx-sender)
(define-data-var total-staked uint u0)
(define-map staked-balances {user: principal} {amount: uint})

(define-public (set-owner (new-owner principal))
    (begin
        (if (is-eq tx-sender (var-get owner))
                (begin
                    (var-set owner new-owner)
                    (ok true))
                ERR_UNAUTHORIZED)
    )
)

(define-public (stake (amount uint))
    (begin
        (if (<= amount u0)
                ERR_ZERO_AMOUNT
                (let (
                            (current (default-to u0 (get amount (map-get? staked-balances {user: tx-sender}))))
                            (new-total (+ (var-get total-staked) amount))
                            (new-balance (+ current amount))
                        )
                    (begin
                        (var-set total-staked new-total)
                        (map-set staked-balances {user: tx-sender} {amount: new-balance})
                        (ok new-balance)
                    )
                )
        )
    )
)

(define-public (unstake (amount uint))
    (let (
                (current (default-to u0 (get amount (map-get? staked-balances {user: tx-sender}))))
            )
        (if (or (<= amount u0) (> amount current))
                ERR_INSUFFICIENT_BALANCE
                (let (
                            (new-balance (- current amount))
                            (new-total (- (var-get total-staked) amount))
                        )
                    (begin
                        (var-set total-staked new-total)
                        (map-set staked-balances {user: tx-sender} {amount: new-balance})
                        (ok new-balance)
                    )
                )
        )
    )
)

(define-read-only (get-staked (user principal))
    (default-to u0 (get amount (map-get? staked-balances {user: user})))
)

(define-read-only (get-total-staked)
    (var-get total-staked)
)
