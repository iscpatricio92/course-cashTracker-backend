import bcrypt from 'bcrypt'

export const hashPassword = async (password: string): Promise<string> => {
    const saltRounds = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, saltRounds)
}

export const checkPassword = async (password: string, hash: string): Promise<boolean> => {
    return await bcrypt.compare(password, hash)
}