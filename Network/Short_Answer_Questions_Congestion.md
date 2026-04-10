# Short Answer Questions: "Congestion Avoidance and Control" (Jacobson, 1988)

---

## Q1. What was the "congestion collapse" of 1986, and what caused it?

**Answer:** In October 1986, throughput between LBL and UC Berkeley dropped from 32 Kbps to just 40 bits per second. The network was not broken but clogged: packets were dropped at routers due to full buffers, hosts retransmitted aggressively assuming loss, and the retransmissions filled the buffers even faster. This created a positive feedback loop — more loss led to more retransmission, which led to more congestion.

**Important Points:**
- The network was carrying mostly retransmissions, doing useful work close to zero.
- The original TCP/IP design had no congestion control mechanism — this paper retrofitted it.

---

## Q2. State and explain the "Conservation of Packets" principle.

**Answer:** For a connection to flow smoothly at equilibrium, a new packet should not be put into the network until an old packet leaves. This ensures the network operates at the bottleneck capacity but not beyond it. If every connection obeys this principle, the network remains stable and congestion-free.

**Important Points:**
- Three failures of this principle are addressed: (1) the connection doesn't reach equilibrium (Slow Start), (2) the sender injects packets too soon (Timer Management), (3) equilibrium can't be maintained (Congestion Avoidance).

---

## Q3. How does the Slow Start algorithm work and what problem does it solve?

**Answer:** Slow Start solves the problem of bringing a new connection up to network capacity without overwhelming it. It introduces a congestion window (`cwnd`) starting at 1 packet. For every ACK received, `cwnd` is incremented by 1, resulting in exponential growth (1, 2, 4, 8...). This quickly probes for available bandwidth until a packet loss signals that capacity has been reached.

**Important Points:**
- Despite its name, Slow Start grows *exponentially* — it's "slow" compared to the old approach of blasting a full window of data immediately.
- Slow Start brings the connection to equilibrium, addressing the first failure of packet conservation.

---

## Q4. Why was the original RTO (Retransmission Timeout) calculation in RFC 793 inadequate?

**Answer:** The original RFC 793 algorithm used only the average RTT to set the retransmission timer and ignored *variance*. In loaded networks where RTT variance is high, this led to RTOs that were either too short (causing spurious retransmissions that waste bandwidth and worsen congestion) or too long (causing idle waiting and poor performance).

**Important Points:**
- Jacobson's fix includes the mean deviation (variance): $RTO = RTT + 4 \times Var$.
- The smoothed RTT and variance are updated incrementally: $RTT = (1-g) \times RTT + g \times Sample$ and $Var = (1-h) \times Var + h \times |Sample - RTT|$.
- This makes the timeout adapt dynamically to network load conditions.

---

## Q5. What is AIMD (Additive Increase, Multiplicative Decrease) and why is it the correct strategy?

**Answer:** AIMD is the congestion avoidance strategy where on packet loss (congestion signal), the sender halves its sending rate (multiplicative decrease: $ssthresh = cwnd/2$, $cwnd = 1$), and during normal operation, it increases linearly (additive increase: $cwnd += 1/cwnd$ per ACK). Jacobson proves that AIMD is the only stable strategy for sharing a bottleneck link fairly and efficiently — multiplicative increase leads to instability.

**Important Points:**
- Multiplicative decrease provides a rapid response to congestion, quickly freeing resources.
- Additive increase gently probes for available bandwidth without overshooting.
- The combination ensures convergence to a fair, efficient operating point.

---

## Q6. Describe the complete lifecycle of congestion control for a TCP connection.

**Answer:** (1) **Start:** Use Slow Start to ramp up exponentially from `cwnd = 1`. (2) **Loss detected:** Assume congestion — set `ssthresh = cwnd / 2` and reset `cwnd = 1` (Multiplicative Decrease). (3) **Recovery:** Use Slow Start again to grow exponentially back up to `ssthresh`. (4) **Switch:** Once `cwnd` reaches `ssthresh`, switch to Congestion Avoidance (linear/additive increase) to gently probe for the new limit.

**Important Points:**
- `ssthresh` (slow start threshold) is the memory of the last known safe operating point (halved).
- Slow Start is used for rapid recovery; Congestion Avoidance is used for careful probing near capacity.

---

## Q7. What is the role of the `ssthresh` (slow start threshold) variable?

**Answer:** `ssthresh` marks the boundary between exponential growth (Slow Start) and linear growth (Congestion Avoidance). When loss occurs, `ssthresh` is set to half the current `cwnd`, recording an estimate of the safe capacity. During recovery, Slow Start is used until `cwnd` reaches `ssthresh`, after which the connection switches to the more cautious Congestion Avoidance mode to avoid triggering congestion again.

**Important Points:**
- `ssthresh` represents "half the rate that caused congestion" — a conservative estimate of safe throughput.
- This two-phase approach balances fast recovery with stability.

---

## Q8. Why does Slow Start use exponential growth rather than linear growth?

**Answer:** A new connection has no information about the network's capacity. Linear growth would take too long to reach the available bandwidth (especially on high-capacity links), leading to underutilization. Exponential growth (doubling each RTT) quickly probes the network and reaches capacity within $\log_2(BDP)$ round trips. Overshooting by at most one doubling is acceptable since the Multiplicative Decrease mechanism handles the resulting loss.

**Important Points:**
- Exponential growth is appropriate when the connection has no prior knowledge of capacity.
- After the first loss, `ssthresh` provides a target, so subsequent Slow Start phases stop earlier.

---

## Q9. How does a TCP sender detect congestion?

**Answer:** A TCP sender detects congestion through packet loss, which is indicated by either a retransmission timeout (RTO expiring without receiving an ACK) or, in later refinements, by receiving duplicate ACKs. Since the Internet provides only best-effort delivery with no explicit congestion signals, packet loss is used as an *implicit* signal that a buffer somewhere has overflowed due to congestion.

**Important Points:**
- This implicit signaling is a consequence of the Internet's datagram design — routers don't send explicit congestion notifications in the basic model.
- Later mechanisms like ECN (Explicit Congestion Notification) added explicit signaling, but Jacobson's original work relies purely on loss.

---

## Q10. What is the relationship between Jacobson's congestion control work and the Conservation of Packets principle?

**Answer:** The Conservation of Packets principle is the theoretical foundation for all three algorithms. Slow Start brings the connection to equilibrium (establishes conservation). Improved RTT estimation ensures the sender doesn't inject packets prematurely (maintains conservation via accurate timers). Congestion Avoidance adjusts the sending rate when the equilibrium point changes due to competing traffic or network changes (restores conservation after disruption).

**Important Points:**
- If all connections conserve packets, the aggregate network load stays at or below capacity.
- Each algorithm addresses a specific way conservation can fail.

---

## Q11. What was the practical impact of Jacobson's algorithms on the Internet?

**Answer:** These algorithms effectively saved the Internet from congestion collapse. Before Jacobson's work, senders had no mechanism to adapt to congestion, leading to catastrophic performance degradation under load. After deployment, TCP connections could share bottleneck links stably and fairly without centralized coordination, enabling the Internet to scale from thousands to billions of users.

**Important Points:**
- The algorithms were implemented in BSD Unix TCP and quickly adopted across the Internet.
- They demonstrated that endpoint-only congestion control (no router changes required) could work, consistent with the end-to-end principle.

---

## Q12. How does the multiplicative decrease factor of 1/2 relate to fairness among competing TCP flows?

**Answer:** When multiple TCP flows share a bottleneck and experience loss simultaneously, each halves its `cwnd`. Then during additive increase, each flow increases by the same amount (approximately 1 MSS per RTT). This ensures that flows converge toward an equal share of bandwidth over time. The halving is aggressive enough to quickly free bandwidth during congestion, while the uniform additive increase distributes the recovered bandwidth fairly.

**Important Points:**
- AIMD provably converges to a fair allocation where each flow gets an equal share.
- Flows with different RTTs may not achieve perfect fairness (longer RTT flows increase more slowly), but the basic mechanism trends toward equity.

---
