export const Terbilang = () => {
    const arrAngka = ['', 'satu', 'dua', 'tiga', 'empat', 'lima', 'enam', 'tujuh', 'delapan', 'sembilan']
    const arrSatuan = ['', 'ribu', 'juta', 'milyar', 'triliun', 'quadriliun', 'quintiliun', 'sextiliun', 'septiliun', 'oktiliun', 'noniliun', 'desiliun', 'undesiliun', 'duodesiliun', 'tredesiliun', 'quattuordesiliun', 'quindesiliun', 'sexdesiliun', 'septendesiliun', 'oktodesiliun', 'novemdesiliun', 'vigintiliun']

    function toTerbilang(strAngka) {
        if (isNaN(strAngka)) {
            return 'Error, input is not a valid number!'
        }

        const lenAngka = strAngka.length - 1

        if (lenAngka === 0 && Number(strAngka[0]) === 0) {
            return 'nol'
        }

        if ((lenAngka / 3) > arrSatuan.length) {
            return "Error, number is to big!"
        }

        let resTerbilang = ''

        let cntZero = 0

        for (let i = 0; i <= lenAngka; i++) {
            let tmpTerbilang = ''

            let posDigit = lenAngka - i
            let grpDigit = posDigit % 3

            let intAngka = Number(strAngka[i])

            switch (intAngka) {
                case 1:
                    switch (grpDigit) {
                        case 2:
                            tmpTerbilang += 'seratus'
                            break

                        case 1:
                            let nextIntAngka = Number(strAngka[i + 1])

                            switch (nextIntAngka) {
                                case 1:
                                    tmpTerbilang += 'sebelas'
                                    break

                                case 0:
                                    tmpTerbilang += 'sepuluh'
                                    break

                                default:
                                    tmpTerbilang += arrAngka[nextIntAngka] + ' belas'
                                    break
                            }

                            i++

                            posDigit--
                            grpDigit--
                            break

                        case 0:
                            if ((intAngka === 1 && posDigit === 3) && (cntZero === 2 || lenAngka === 3)) {
                                if (resTerbilang !== '') {
                                    resTerbilang += ' '
                                }

                                resTerbilang += 'seribu'

                                cntZero = 0
                                continue
                            } else {
                                tmpTerbilang += arrAngka[intAngka]
                            }
                    }
                    break

                case 0:
                    cntZero++
                    break

                default:
                    tmpTerbilang += arrAngka[intAngka]

                    switch (grpDigit) {
                        case 2:
                            tmpTerbilang += ' ratus'
                            break

                        case 1:
                            tmpTerbilang += ' puluh'
                            break
                    }
                    break
            }

            if (tmpTerbilang !== '') {
                if (resTerbilang !== '') {
                    resTerbilang += ' ' + tmpTerbilang
                } else {
                    resTerbilang += tmpTerbilang
                }
            }

            let posSatuan = posDigit / 3

            if (grpDigit === 0 && posSatuan !== 0) {
                if (cntZero !== 3) {
                    resTerbilang += ' ' + arrSatuan[posSatuan]
                }

                cntZero = 0
            }
        }

        return resTerbilang.toUpperCase()
    }

    return { toTerbilang }
}

