/*
 * This file is part of the nivo project.
 *
 * Copyright 2016-present, Raphaël Benitte.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { isFunction } from 'lodash'
import { format as d3Format } from 'd3-format'
import compose from 'recompose/compose'
import withPropsOnChange from 'recompose/withPropsOnChange'
import pure from 'recompose/pure'
import Chip from './Chip'

const chipStyle = { marginRight: 7 }

const BasicTooltip = props => {
    const { id, value: _value, format, enableChip, color, theme } = props

    let value = _value
    let idFormat = null
    if (format !== undefined && value !== undefined) {
        if (format.length === 1) {
            value = format(value)
        } else if (format.length === 2) {
            const formattedValues = format(id, value) || [id, value]
            idFormat = formattedValues[0]
            value = formattedValues[1]
        }
    }

    return (
        <div style={theme.tooltip.container}>
            <div style={theme.tooltip.basic}>
                {enableChip && <Chip color={color} style={chipStyle} />}
                {value !== undefined ? (
                    <span>
                      {idFormat === null ? `${id}: ` : idFormat}<strong>{value}</strong>
                    </span>
                ) : (
                    id
                )}
            </div>
        </div>
    )
}

BasicTooltip.propTypes = {
    id: PropTypes.node.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    enableChip: PropTypes.bool.isRequired,
    color: PropTypes.string,
    format: PropTypes.func,

    theme: PropTypes.shape({
        tooltip: PropTypes.shape({
            container: PropTypes.object.isRequired,
            basic: PropTypes.object.isRequired,
        }).isRequired,
    }).isRequired,
}

BasicTooltip.defaultProps = {
    enableChip: false,
}

const enhance = compose(
    withPropsOnChange(['format'], ({ format }) => {
        if (!format || isFunction(format)) return { format }
        return { format: d3Format(format) }
    }),
    pure
)

export default enhance(BasicTooltip)
