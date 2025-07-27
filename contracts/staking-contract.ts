
export const StakingContractCode = `
;; Clarity Staking Contract for EduChain Quest (Simulation)
;; This contract allows users to stake and claim reward tokens.

;; --- Constants and Data Maps ---
(define-constant CONTRACT_OWNER tx-sender)
(define-constant ERR_NOT_AUTHORIZED (err u100))
(define-constant ERR_INSUFFICIENT_FUNDS (err u101))
(define-constant ERR_STAKE_MUST_BE_POSITIVE (err u102))

;; Maps principal to the amount they have staked.
(define-map staked-balances principal uint)
;; Maps principal to the amount of rewards they can claim.
(define-map reward-balances principal uint)

;; --- Public Functions ---

;; Stake tokens.
(define-public (stake (amount uint))
  (begin
    (asserts! (> amount u0) ERR_STAKE_MUST_BE_POSITIVE)
    ;; In a real contract, we'd use ft-transfer? to move tokens
    ;; from the user to the contract.
    ;; For simulation, we just update the map.
    (let ((current-stake (get-stake tx-sender)))
      (map-set staked-balances tx-sender (+ current-stake amount))
      (ok true)
    )
  )
)

;; Unstake tokens.
(define-public (unstake (amount uint))
  (begin
    (asserts! (> amount u0) ERR_STAKE_MUST_BE_POSITIVE)
    (let ((current-stake (get-stake tx-sender)))
      (asserts! (>= current-stake amount) ERR_INSUFFICIENT_FUNDS)
      ;; In a real contract, we'd use ft-transfer? to move tokens
      ;; from the contract back to the user.
      (map-set staked-balances tx-sender (- current-stake amount))
      (ok true)
    )
  )
)

;; Claim accumulated rewards.
(define-public (claim-rewards)
  (let ((rewards (get-rewards tx-sender)))
    (asserts! (> rewards u0) (err u103)) ;; ERR_NO_REWARDS_TO_CLAIM
    ;; In a real contract, we'd transfer the reward tokens.
    ;; Here, we just reset their reward balance.
    (map-set reward-balances tx-sender u0)
    (ok rewards)
  )
)

;; --- Read-Only Functions ---

;; Get the staked balance for a given principal.
(define-read-only (get-stake (who principal))
  (default-to u0 (map-get? staked-balances who))
)

;; Get the claimable rewards for a given principal.
(define-read-only (get-rewards (who principal))
  (default-to u0 (map-get? reward-balances who))
)
`;
