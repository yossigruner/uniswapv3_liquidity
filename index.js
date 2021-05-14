const { BigintIsh, MaxUint256, Percent, Price, CurrencyAmount, Token } = require('@uniswap/sdk-core');
const uniswapsdk = require('@uniswap/v3-sdk');
const JSBI = require('jsbi');
const ZERO = JSBI.BigInt(0)
const { log } = require('mathjs');
const { liqudity } = require('./liqudity');


function amount0(token0, tickCurrent, tickLower, tickUpper, liquidity, sqrtRatioX96) {
    if (tickCurrent < tickLower) {
        return new CurrencyAmount(
            token0,
            uniswapsdk.SqrtPriceMath.getAmount0Delta(
                uniswapsdk.TickMath.getSqrtRatioAtTick(tickLower),
                uniswapsdk.TickMath.getSqrtRatioAtTick(tickUpper),
                liquidity,
                false
            )
        )
    } else if (tickCurrent < tickUpper) {
        return new CurrencyAmount(
            token0,
            uniswapsdk.SqrtPriceMath.getAmount0Delta(
                sqrtRatioX96,
                uniswapsdk.TickMath.getSqrtRatioAtTick(tickUpper),
                liquidity,
                false
            )
        )
    }
    return new CurrencyAmount(token0, ZERO)
}

function amount1(token1, tickCurrent, tickLower, tickUpper, liquidity, sqrtRatioX96) {
    if (tickCurrent < tickLower) {
        return new CurrencyAmount(token1, ZERO)
    } else if (tickCurrent < tickUpper) {
        return new CurrencyAmount(
            token1,
            uniswapsdk.SqrtPriceMath.getAmount1Delta(
                uniswapsdk.TickMath.getSqrtRatioAtTick(tickLower),
                sqrtRatioX96,
                liquidity,
                false
            )
        )
    } else {
        return new CurrencyAmount(
            token1,
            uniswapsdk.SqrtPriceMath.getAmount1Delta(
                uniswapsdk.TickMath.getSqrtRatioAtTick(tickLower),
                uniswapsdk.TickMath.getSqrtRatioAtTick(tickUpper),
                liquidity,
                false
            )
        )
    }
}

function main() {

    var addressToken0 = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
    var addressToken1 = "0xea6412Fb370e8d1605E6aEeAA21aD07C3C7e9F24";
    var liquidity = JSBI.BigInt('16563662950480208561617');

    var sqrtPrice = JSBI.BigInt('3973847124901695199902404570816')
    var currentTick = 78533;

    var tickLowerPrice = 2439.650391863031688145375912340595;
    var tickLower = Math.round(log(tickLowerPrice, 1.0001))
    console.log("Lower tick: " + tickLower)

    var tickUpperPrice = 2440;
    var tickUpper = Math.round(log(tickUpperPrice, 1.0001))
    console.log("Upper tick: " + tickUpper)

    var token0 = new Token(1, addressToken0, 18, 'weth', 'weth')
    amount0Token0 = amount0(token0, currentTick, tickLower, tickUpper, liquidity, sqrtPrice)

    var token1 = new Token(1, addressToken1, 18, 'mush', 'mush')
    amount1Token1 = amount1(token1, currentTick, tickLower, tickUpper, liquidity, sqrtPrice)

    console.log("Token0 Amount : " + amount0Token0.toSignificant(4));
    console.log("Token1 Amount : " + amount1Token1.toSignificant(4));


    var tickPrice = uniswapsdk.tickToPrice(token0, token1, 77400)
    console.log("tickPrice : " + tickPrice.toFixed(4));
    var tickPrice2 = uniswapsdk.tickToPrice(token0, token1, 81200)
    console.log("tickPrice2 : " + tickPrice2.toFixed(4));

    liqudity.oneFunction()

    var mushPoolAddress = "0x5116f278d095ec2ad3a14090fedb3e499b8b5af6"
    var result = liqudity.fetchTicksSurroundingPrice(mushPoolAddress);
    console.log("result: " + JSON.stringify(result))
}

main()
